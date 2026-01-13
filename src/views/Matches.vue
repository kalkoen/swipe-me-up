<template>
  <div>
    <Modal 
    :modal="modal" 
    @close="modal = null;" 
    :profile="last_clicked"
    :preferences="preferences"
    @unmatch="(profile) => $emit('unmatch', profile)" :unmatch="true"
    @resetApp="$emit('resetApp')" 
    :resetButton="true"
    @updatePreferences="(preferences) => $emit('update-preferences', preferences)"></Modal>


    <div class="welcome center">

      <h1>YOUR MATCHES</h1>
      <br>
      <ul v-if="matches.length > 0" class="matches">
        <hr>
        </hr>
        <li v-for="(profile, index) in matches" @click="openMatch(profile)" :key="profile.id" class="match">
          <SmallProfile :profile="profile" :key="profile.id"></SmallProfile>
          <hr>
          </hr>
        </li>
      </ul>
      <div v-else>
        <p>You do not have any matches yet!</p>
      </div>

      <br>
      <button @click="$emit('close')" class="start">CONTINUE SWIPING →</button>
      <button @click="changePreferences" class="change-preferences">CHANGE PREFERENCES </button>


      <br>
    </div>
  </div>



</template>

<script>
import SmallProfile from '@/components/SmallProfile.vue';
import Match from './Match.vue'
import Preferences from './Preferences.vue'
import Welcome from './Welcome.vue'
import Modal from "@/components/Modal.vue"

import { shallowRef } from 'vue';

export default {
  name: 'Matches',
  props: {
    matches: {
      type: Array,
      default: () => []
    },
    preferences: {
      type: Object
    }
  },
  data: () => ({
    modal: null,
    last_clicked: null
  }),
  components: {
    SmallProfile,
    Match,
    Modal
  },
  methods: {
    openMatch(profile) {
      this.last_clicked = profile
      this.modal = shallowRef(Match)
    },
    openInfo() {
      this.modal = shallowRef(Welcome)
    },
    changePreferences() {
      this.modal = shallowRef(Preferences)
    },

  }
}
</script>


<style scoped>
.match {
  user-select: none;
}

.matches {
  overflow-y: auto;
  max-height: 55vh;
}

.change-preferences {
  background-color: var(--vt-c-pink);
  color: var(--vt-c-blue);
  margin-top: 10px;
}

</style>
