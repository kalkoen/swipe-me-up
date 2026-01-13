
// This file does important preprocessing
// It is designed to take form responses as an Excel sheet, and turn it into JSON for the frontend to use
// It is recommended to keep the original input excel as the editable data source.
// The (final) preprocessing should be done when the profiles are ready for publication
// Any changes to the profiles should be done in the original excel, and when ready for publishing,
// this script is to be rn. In short, NEVER manually change the profiles.json that is generated here.


const readXlsxFile = require('read-excel-file/node')
const writeJson = require('write-json');
const fs = require('fs');
const likert_map = {
  "Not really": 0,
  "Slightly": 1,
  "A bit": 2,
  "Reasonably": 3,
  "Quite a bit": 4,
  "Very much": 5,
  "Completely": 6
}

function removeNonAlphaNumeric(inputString) {
    return inputString.split('').reduce((acc, char) => {
        return /[a-zA-Z0-9]/.test(char) || char == "_" ? acc + char : acc;
    }, '');
}

function name_to_id(name) {
  return removeNonAlphaNumeric(name.replaceAll(" ", "_"))
}


let image_counter = 0;
function anonymize_image(image_url, association_name) {
  image_url = decodeURIComponent(image_url).trim();
  if (image_url.startsWith("https://")) {
    image_parts = image_url.split("/")
    filename = image_parts.pop()
    question = image_parts.pop()
    split_by_dot = filename.split(".")
    extension = split_by_dot.pop()
    basename = split_by_dot.join(".")
    if (!fs.existsSync(`public/profiles/images/${association_name}`)) {
      fs.mkdirSync(`public/profiles/images/${association_name}`, (err) => {})
    }
    if (["jpeg", "jpg", "png", "svg"].includes(extension.toLowerCase())) {
      extension = "jpg"
    }
    path_to_image = `preprocessing/input_images/${question}/${basename}.${extension}` 
  } else {
    path_to_image = `preprocessing/input_images/${image_url}`;
    split_by_dot = image_url.split(".")
    extension = split_by_dot.pop()
    basename = split_by_dot.join(".")
    if (!fs.existsSync(`public/profiles/images/${association_name}`)) {
      fs.mkdirSync(`public/profiles/images/${association_name}`, (err) => {})
    }
  }


  // ASSERT IMAGES ARE PROPER
  new_name = association_name + "_" + image_counter + "." + extension
  new_subpath = association_name + "/" + new_name

  if(!fs.existsSync(path_to_image)) {
    console.warn(`---------- File ${path_to_image} not found!! Skipping`)
    return;
  }
  fs.copyFile(path_to_image, `public/profiles/images/${new_subpath}`, (err) => {
    if (err) {
        console.log("--------- Error Found:", err);
    }
  })
  image_counter += 1
  return new_subpath
}

function anonymize_images(form_response, association_name) {
  if (form_response) {
    return form_response.split(";").map((image_url) => anonymize_image(image_url, association_name));
  } else {
    return []
  }
}


// File path.
readXlsxFile('preprocessing/input.xlsx').then((rows) => {
  headers = rows[0]
  associations = rows.slice(1)

  i = {}
  for (const [index, element] of headers.entries()) {
    i[element.toString()] = index
  }

  json = {}

  for (const d of associations) {
    a = Object()
    ass_name = name_to_id(d[i["Association/organization name"]])

    a.id = ass_name

    a.display_name = d[i["Display name"]]
    a.emoji = d[i["Emoji that fits your association"]]
    a.description = d[i["Description of your association"]]
    a.year = d[i["Year of establishment"]]
    a.adjectives = d[i["Which adjectives fit members of your association?"]]

    // TODO change
    // a.categories = d[i["Rank which categories best describe your association (used for the matching algorithm, not shown on the profile)"]]
    
    a.story = d[i["Tell something about yourself!"]]
    a.main_image = anonymize_image(d[i["Main photo or video"]], ass_name)
    a.images = anonymize_images(d[i["Additional photos and videos"]], ass_name)
    
    
    blocks = []

    for (const j of [1,2, 3, 4]) {
        heading = d[i[`Heading for information block ${j}`]]
        content = d[i[`Content for information block ${j}`]]
        if (content == "&nbsp;") {
            blocks.push({heading: "", content: ""})
        } else if (content) {
          blocks.push({
            heading: heading,
            content: content
          })
        }
    }
    a.blocks = blocks

    introduce_member = d[i["Do you want to introduce a person in your profile?"]]

    if (introduce_member == "Yes") {
      member = Object()

      member.name = d[i["Member name"]]
      member.role = d[i["Role within association"]]
      member.since = d[i["Is a member since"]]
      member.story = d[i["Personal story"]]
      member.images = anonymize_images(d[i["Member photos and videos"]], ass_name)

      a.member = member
    }
    
    a.match = d[i["What would you like to say to a student that matched with your association?"]]

    a.interests = {}
  
    for (const interest of ["Sports", "Culture",	"Identity",	"Career",	"Study",	"Gezelligheid",	"Religion"]) {
      a.interests[interest.toLowerCase()] = likert_map[d[i[interest]]]
    }

    link = d[i["Link"]]
    if (link && !link.startsWith("https")) {
      link = "https://app.introtue.tactile.events/~/introtue.tactile.events/knowledge/" + link
    }
    a.link = link

    if (d[i["Belongs to"]]) {
      a.parent = name_to_id(d[i["Belongs to"]])
    }

    console.log(`${d[i["Contact email"]]}\thttps://intro.koenvdberk.com/profiles/${a.id}`)

    json[ass_name] = a
  }

  writeJson.sync('public/profiles/profiles.json', json);

})

