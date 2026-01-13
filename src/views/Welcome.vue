<script setup>
import { ref } from 'vue';

</script>

<template>
  <div class="welcome center">

    <h1>WELCOME, STUDENT, TO SWIPE ME UP
    </h1>

    <br>

    <p>Liking the intro so far? Here, you can <em>Swipe</em> association, student teams and more! Explore what TU/e
      student life has to offer and
      find a place just
      for you! </p>

    <br>
    <h3> How does it work?</h3>



    <ul>
      <li>
        <div class="icon">
          <img class="svg" src="/images/down-arrow-icon.svg" alt="Icon" />
        </div>
        &nbsp; Scroll down to view a profile
      </li>
      <li>
        <img class="icon" src="/images/like.png" />
        &nbsp; Swipe right if you like what you see
      </li>
      <li>
        <img class="icon" src="/images/nope.png" />
        &nbsp; Swipe left to see the next profile
      </li>
      <br>
    </ul>
    <p>Have fun! Hope you find a match!</p>

    <br>
    <p><em>Note: swiping is anonymous. Your data will not be shared others. </em></p>

    <br>
    <button @click="$emit('close')" class="start">START SWIPING →</button>

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

.slider {
  width: 100%;
}

.slider-label {
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

.svg {
  width: 80%;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  text-align: center;
}
</style>
