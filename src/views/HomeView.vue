<template>

  <Modal :modal="modal" @close="modal = null;" :profile="last_match" :matches="matches" :preferences="preferences"
    @updatePreferences="updatePreferences" @unmatch="unmatchProfile" @resetApp="clearState"></Modal>

  <Tinder :style="{ pointerEvents: pointerEvents }" ref="tinder" key-name="id" v-model:queue="queue" :max="2"
    :offset-y="5" :allow-down="false" :allow-super="false" @submit="onSubmit">
    <template #default="{ data }">
      <Profile :profile="data"></Profile>
    </template>
    <template #like>
      <img class="like-pointer" src="/images/like.png" />
    </template>
    <template #nope>
      <img class="nope-pointer" slot="nope" src="/images/nope.png" />
    </template>
    <!-- <template #super>
      <img class="super-pointer" slot="super" src="/images/super-like.png" />
    </template> -->
    <template #down>
      <img class="down-pointer" slot="down" src="/images/nope.png" />
    </template>
    <template #rewind>
      <img class="rewind-pointer" slot="rewind" src="/images/rewind-txt.png" />
    </template>
  </Tinder>


  <div class="btns ">
    <img :src="`${BASE_URL}images/rewind.png`" @click="decide('rewind')" />
    <img :src="`${BASE_URL}images/nope.png`" @click="decide('nope')" />
    <!-- <img src="/images/super-like.png" @click="decide('super')" /> -->
    <img :src="`${BASE_URL}images/like.png`" @click="decide('like')" />
    <img :src="`${BASE_URL}images/help.png`" @click="decide('help')" />
  </div>
</template>

<script>
import { shallowRef, toRaw } from 'vue'

import Tinder from '@/components/vue-tinder/Tinder.vue'
import Profile from "@/components/Profile.vue"
import Modal from "@/components/Modal.vue"

// import profiles from "@/assets/profiles.json"
import Preferences from './Preferences.vue'
import Welcome from './Welcome.vue'
import Match from './Match.vue'
import Matches from './Matches.vue'
import { routeLocationKey, useRoute } from 'vue-router'

import { BASE_URL } from '@/config/basePath'

export default {
  name: 'App',
  components: { Tinder, Profile, Modal },
  data: () => ({
    profiles: {},
    queue: [],
    offset: 0,
    history: [],
    matches: [],
    preferences: {
      "sports": 3,
      "culture": 3,
      "identity": 3,
      "career": 3,
      "study": 3,
      "gezelligheid": 3,
      "religion": 3
    },
    modal: null,
    pointerEvents: "none",
    last_match: null,
    show_single_profile: null,
    BASE_URL: BASE_URL
  }),
  created() {
    this.show_single_profile = this.$route.params.id

    if (this.show_single_profile || this.isStateSaved()) {
      this.pointerEvents = 'all'
    } else {
      setTimeout(() => this.modal = shallowRef(Welcome), 1500);
      setTimeout(() => this.pointerEvents = 'all', 1500);
    }

    fetch(`${BASE_URL}profiles/profiles.json`)
      .then(response => response.json())
      .then(data => {
        this.profiles = data
        this.load()
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
      });
  },
  methods: {
    load() {
      if (this.show_single_profile) {
        for (const [key, value] of Object.entries(this.profiles)) {
          if (key.toLowerCase() == this.show_single_profile.toLowerCase()) {
            this.queue = [value]
            value.score = 0
          }
        }
      } else {
        let CIC = null
        let newQueue = []

        for (const [key, value] of Object.entries(this.profiles)) {
          if (value.parent) {
            if (this.profiles[value.parent].children) {
              this.profiles[value.parent].children.push(key)
            } else {
              this.profiles[value.parent].children = [key]
            }
          }
        }

        for (const [key, value] of Object.entries(this.profiles)) {
          if (key == "CIC") {
            CIC = value
          } else {
            if (!value.parent) {
              newQueue.push(value)
            }
          }
        }
        newQueue.sort((a, b) => 0.5 - Math.random());
        newQueue.unshift(CIC)

        if (localStorage.getItem('queue')) {
          const queueData = JSON.parse(localStorage.getItem('queue'));
          const matchesData = JSON.parse(localStorage.getItem('matches'));
          const historyData = JSON.parse(localStorage.getItem('history'));
          const preferencesData = JSON.parse(localStorage.getItem('preferences'));

          this.queue = this.keysToProfiles(queueData);
          this.matches = this.keysToProfiles(matchesData);
          this.history = this.keysToProfiles(historyData);
          this.preferences = preferencesData;
        } else {
          this.queue = newQueue
          this.saveState()
        }



      }
    },
    onSubmit({ type, key, item }) {
      if (item.id == "CIC" && !this.show_single_profile) {
        this.modal = shallowRef(Preferences)
      }

      if (type === 'like') {
        this.matches.push(item)

        if (item.id != "CIC") {
          this.last_match = item
          this.modal = shallowRef(Match)
        }

        if (item.children) {
          let newQueue = this.queue.slice()
          for (const child of item.children) {
            newQueue.push(this.profiles[child])
          }
          newQueue.sort((a, b) => a.score - b.score)
          this.queue = newQueue
        }
      }

      // if (this.queue.length < 1) {
      //   this.modal = shallowRef(WhoAreYou)
      // }
      this.history.push(item)

      // TODO change to watcher for each of the state parts?
      this.saveState()
    },
    async decide(choice) {
      if (choice === 'rewind') {
        if (this.history.length) {
          this.$refs.tinder.rewind([this.history.pop()])
        }
      } else if (choice === 'help') {
        this.modal = shallowRef(Matches)
      } else {
        this.$refs.tinder.decide(choice)
      }
    },
    scrollDown(index, amount) {
      const refName = `profile_${index}`;
      const el = this.$refs[refName];
      if (el) {
        el.scrollTop += amount;
      }
    },
    updatePreferences() {
      let newQueue = this.queue.slice()
      for (const [key, profile] of Object.entries(this.profiles)) {
        profile.score = this.matchScore(this.preferences, profile.interests) + this.gaussianRandom(0, 3)
      }
      newQueue.sort((a, b) => a.score - b.score)
      this.queue = newQueue
      this.saveState()
    },
    matchScore(interests1, interests2) {
      let score = 0;
      Object.keys(interests1).forEach(key => {
        score += Math.abs(interests1[key] - interests2[key], 1);
      })
      return score;
    },
    gaussianRandom(mean = 0, stdev = 1) {
      const u = 1 - Math.random(); // Converting [0,1) to (0,1]
      const v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    },
    unmatchProfile(profile) {
      this.matches.splice(this.matches.indexOf(profile), 1);
      this.queue.push(profile);
      this.saveState();
    },
    isStateSaved() {
      return localStorage.getItem('queue') !== null &&
        localStorage.getItem('matches') !== null &&
        localStorage.getItem('history') !== null;
    },
    saveState() {
      const queueData = this.queue.map(item => item.id);
      // Convert matches and history to their IDs for storage
      const matchesData = this.matches.map(item => item.id);
      const historyData = this.history.map(item => item.id);
      const preferencesData = this.preferences;
      localStorage.setItem('queue', JSON.stringify(queueData));
      localStorage.setItem('matches', JSON.stringify(matchesData));
      localStorage.setItem('history', JSON.stringify(historyData));
      localStorage.setItem('preferences', JSON.stringify(preferencesData));
    },
    keysToProfiles(keys) {
      return keys.map(key => this.profiles[key]);
    },
    clearState() {
      localStorage.removeItem('queue');
      localStorage.removeItem('matches');
      localStorage.removeItem('history');
      localStorage.removeItem('preferences');
    }
  }
}
</script>

<style>
body {
  overflow: hidden;
}

#app .vue-tinder {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 10px;
  margin: auto;
  width: calc(100% - 20px);
  height: calc(100% - 65px - 47px);
  min-width: 300px;
  max-width: 400px;
}


.nope-pointer,
.like-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  width: 64px;
  height: 64px;
}

.nope-pointer {
  right: 10px;
}

.like-pointer {
  left: 10px;
}

.super-pointer,
.down-pointer {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  margin: auto;
  width: 112px;
  height: 78px;
}

.super-pointer {
  bottom: 40px;
}

.down-pointer {
  top: 40px;
}

.rewind-pointer {
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 10px;
  width: 112px;
  height: 78px;
}

#app .btns {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
  margin: auto;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btns img {
  margin-right: 12px;
  box-shadow: 0 4px 9px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btns img:nth-child(1),
.btns img:nth-child(4) {
  width: 53px;
}

.btns img:nth-child(2),
.btns img:nth-child(3) {
  width: 65px;
}

.btns img:nth-last-child(1) {
  margin-right: 0;
}
</style>
