# Swipe Me Up | TU/e Introduction Week

An interactive, gesture-based discovery web application developed for **Eindhoven University of Technology (TU/e)** Introduction events, namely the Welcome Days, Introduction Week, and Master Kick Off. This tool gamifies the discovery of 100+ student associations, sports clubs, and cultural initiatives for incoming freshmen. The interface resembles a dating app.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4fc08d?style=for-the-badge&logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)
![Status](https://img.shields.io/badge/Status-Live_Demo-success)

## 🔗 Live Demo
As of January 2026, a live demo of the application is available at:  
**[crashplace.nl/swipemeup](https://crashplace.nl/swipemeup)**



## 🚀 Features and Architecture

### 1. Custom Matching Logic
A "Match" (right swipe) triggers a transition to a dedicated match screen featuring:
* **Association-Specific Messaging:** Displays a unique matching message provided by the association.
* **Deep Linking:** Provides direct navigation to the association's specific landing page within the official **Tactile TU/e Intro App**.

### 2. Preferences & Ranking Algorithm
The application moves beyond simple filtering by implementing a **score-based ranking algorithm**:
* **Onboarding:** Users indicate their initial interests and preferences.
* **Sorting:** The card stack is dynamically ranked based on these preferences, ensuring students see the most relevant associations first while still allowing for a varied discovery experience.

### 3. Swiping UI & Persistence
* **Interface:** Powered by the [VueTinder](https://github.com/shanlh/vue-tinder) library for high-performance touch and mouse gesture handling.
* **State:** User progress, "likes," and "dislikes" are persisted via **LocalStorage**, allowing for a stateless frontend and a consistent user experience across sessions.

### 4. Security & Data Handling
The application balances security with the need for rich content:
* **Standard Content:** Card data (names, basic info) is rendered using standard Vue template interpolation, leveraging Vue’s built-in XSS protection.
* **Match Screen Purification:** Because the matching screen allows for active links and formatted messages, the input is sanitized via `dompurify` during the preprocessing stage to ensure only safe HTML is rendered.



## 🛠️ Data Preprocessing

The project includes a dedicated pipeline in the `/preprocessing` directory to transform administrative data into application-ready assets.

### The Pipeline (`process.cjs`)
To streamline data collection from 100+ external organizations, I developed a custom script that bridges the gap between raw Microsoft Forms exports and the production build. 

The script was written for [this exact Form](https://forms.office.com/Pages/ShareFormPage.aspx?id=R_J9zM5gD0qddXBM9g78ZIi9tg9wlKFPrFHtMXiHa5hUMlQ0REVRQ1pTNFlKR05UNVpJQVBaS1JVOS4u&sharetoken=RI7XMRztvH1jTHYnWhkw). Changes in the Form may break `process.cjs`, requiring manual changes in this. preprocessing script. Adding or changing subtitles of questions does **not** break the script.

* Generates application-ready data in the `public/profiles` folder.
* Turns Sharepoint image/video hyperlinks in the Forms results into local paths, and copies the content to the public folder.
* Anonimizes submissions: information about the submitter is not transferred application-ready data, information that is asked in the Forms in case a submitter needs to be contacted about their submission
* Combines all profiles in a JSON file.


It does **NOT** rescale images. Most users will submit high-resolution images, resulting in gigabytes of images. This is too slow for production. To make the application production-ready, you should make sure the images and videos are compressed and/or resized accordingly. This can be achieved using, for instance, `imagemagick`. 

### Execution
To refresh the data, first place the correct data in the `preprocessing/` folder:
* The Forms export '.xlsx', named `input.xlsx`
* A Folder named `input_images`, containing for each question in the Form the corresponding folder, literally `Question 1`, `Question 2`, `Question 3`. When taken directly from Sharepoint, no further manipulation of these files/folders is needed. Every question will get its own number from Microsoft Forms, and the image files will be hyperlinked in the `input.xlsx`. The preprocessing scripts turns these cloud URLs into local paths.

Then run:
```bash
node preprocessing/process.cjs
```



## 💻 Installation & Build

### 1. Clone the repository

```bash
git clone [https://github.com/kalkoen/swipe-me-up.git](https://github.com/kalkoen/swipe-me-up.git)
cd swipe-me-up
```

### 2. Install dependencies

```bash
npm install
```

### 3. Development

Run the local development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### 4. Build

Compile and minify for production:

```bash
npm run build
```

## 📄 License

This project is licensed under the MIT License.
