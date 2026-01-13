<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
// import { onBeforeMount } from 'vue'

const router = useRouter()

const props = defineProps({
  resetButton: {
    type: Boolean,
    default: false
  },
  preferences: {
    type: Object
  }
})
const emit = defineEmits(['close', 'update-preferences', 'reset-app'])

function shuffleVueArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j]
    array[j] = temp
  }
}

// onBeforeMount()(() => {
//   shuffleVueArray(items.value)
// })

shuffleVueArray(props.preferences)

function continueSwiping() {
  emit('close')
  emit('update-preferences')
}

function resetApp()  {
    if(confirm("Are you sure you want to reset the app? This will clear all your matches and preferences.")) {
      emit('reset-app')
      setTimeout(() => {
        router.go()
      }, 100)
    }
  }

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

</script>

<template>
  <div class="welcome center">
    <h1>WHO ARE YOU?</h1>

    <h3>Looks like you figured out how it works! Great!</h3>
    <p>We would like to show you profiles that match your interests.</p>
    <br>
    <h4>Tell us about your interests!</h4>

    <table class="preferences">
      <thead>
        <tr>
          <th></th>
          <th><span class="slider-label min-label">Not interested</span><span class="slider-label max-label">Very
              interested</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, name) in preferences" :key="name" class="category">
          <td>{{ capitalizeFirstLetter(name) }} </td>
          <td>
            <input type="range" min="0" max="6" step="0.1" v-model="preferences[name]" class="slider">
          </td>
        </tr>
      </tbody>

      

    </table>

    <br>
    <button class="start" @click="continueSwiping">CONTINUE SWIPING →</button>

    <button v-if="resetButton" @click="resetApp" class="reset-app">RESET APP</button>


    <br>
  </div>


</template>



<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}



.preferences {
  width: 100%;
}

.slider {
  width: 100%;
}

.slider-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

.min-label {
  display: inline-block;
  width: 50%;
  text-align: left;
}

.max-label {
  display: inline-block;
  width: 50%;
  text-align: right;
}

.reset-app {
  background-color: var(--vt-c-pink);
  color: var(--vt-c-blue);
  margin-top: 10px;
}
</style>
