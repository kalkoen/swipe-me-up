<template>
  <div>

    <Modal :modal="modal" :profile="profile" @close="modal = null;"></Modal>

    <div class="welcome center">


      <h1>{{ message }}</h1>
      <sup><em> You matched with <strong> {{ profile.display_name }}! </strong></em></sup> <br> <br>

      <div v-html="safe_match"></div>

      <br>

      <p v-if="profile.link">Find out more about <strong>{{ profile.display_name }}</strong> by clicking <a
          target="_blank" href="" @click.prevent="testFunc(profile.link)">here.</a>
      </p>

      <br>
      <button @click="$emit('close')" class="start">CONTINUE SWIPING →</button>
      <button v-if="unmatch" @click="openModal" class="view">VIEW PROFILE</button>
      <button v-if="unmatch" @click="unmatchProfile" class="unmatch">UNMATCH ×</button>
      <br>
    </div>



  </div>



</template>

<script>
import { ref, computed, shallowRef } from 'vue'
import DOMPurify from 'dompurify'
import Modal from "@/components/Modal.vue"
import Welcome from './Welcome.vue'
import Profile from '@/components/Profile.vue'

export default {
  components: {
    Modal,
    Welcome,
    Profile
  },
  props: {
    profile: Object,
    unmatch: Function
  },
  emits: ['unmatch', 'close'],
  data() {
    const messages = [
      "IT'S A MATCH!",
      "WE'RE ON THE SAME WAVELENGTH!",
      "SINE US UP FOR A DATE?",
      "LET'S MEET, COS I LIKE YOU TOO!",
      "WE'RE VIBING AT MAX AMPLITUDE!",
      "YOU RESONATE WITH US!",
      "LET'S GO OFF ON A TANGENT TOGETHER!",
      "I FREQUENTLY THINK OF YOU!"
    ]
    return {
      modal: null,
      message: messages[Math.floor(Math.random() * messages.length)],
      messages
    }
  },
  computed: {
    safe_match() {
      const linkify = (text) => {
        if (!text) return ''
        const urlRegex = /(?:https?:\/\/|www\.)[^\s<]+[^.,:;"'\]\s<]/g
        return text.replace(urlRegex, match => {
          const href = match.startsWith('www.') ? `https://${match}` : match
          return `<a @click.prevent="testFunc(${href})" href="" target="_blank" rel="noopener noreferrer">${match}</a>`
        })
      }
      return DOMPurify.sanitize(linkify(this.profile.match), {
        ALLOWED_TAGS: ['a'],
        ALLOWED_ATTR: ['href', 'target', 'rel']
      })
    }
  },
  methods: {
    openModal() {
      this.modal = shallowRef(Profile)
    },
    unmatchProfile() {
      this.$emit('close')
      this.$emit('unmatch', this.profile)
    },
    testFunc(href) {
      window.open(href, '_system', 'noopener noreferrer')
    }
  }
}
</script>


<!-- <script setup>
import { ref, defineProps, computed, shallowRef} from 'vue';
import DOMPurify from 'dompurify';
import Modal from "@/components/Modal.vue";
import Welcome from './Welcome.vue';
import Profile from '@/components/Profile.vue';


function linkify(text) {
  console.log("Linkifying text:", text);
  if (!text) {
    return ''
  }

  const urlRegex = /(?:https?:\/\/|www\.)[^\s<]+[^.,:;"'\]\s<]/g;

  return text.replace(urlRegex, match => {
    const href = match.startsWith('www.') ? `https://${match}` : match;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${match}</a>`;
  });
}

const props = defineProps(['profile', 'unmatch'])
const emit = defineEmits(['unmatch', 'close'])

const modal = ref(null);

function openModal() {
  modal.value = shallowRef(Welcome);
}

const safe_match = computed(() => DOMPurify.sanitize(linkify(props.profile.match), {
  ALLOWED_TAGS: ['a'],
  ALLOWED_ATTR: ['href', 'target', 'rel']
}));

const messages = [
  "IT'S A MATCH!",
  "WE'RE ON THE SAME WAVELENGTH!",
  "SINE US UP FOR A DATE?",
  "LET'S MEET, COS I LIKE YOU TOO!",
  "WE'RE VIBING AT MAX AMPLITUDE!",
  "YOU RESONATE WITH US!",
  "LET'S GO OFF ON A TANGENT TOGETHER!",
  "I FREQUENTLY THINK OF YOU!"
]
const message = ref(messages[Math.floor(Math.random() * messages.length)]);

function unmatchProfile() {
  emit('close')
  emit('unmatch', props.profile)
}

</script>
-->

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

.unmatch {
  background-color: var(--vt-c-pink);
  color: var(--vt-c-blue);
  margin-top: 10px;
}

.unmatch:active {
  background-color: gray
}

.view {
  background-color: var(--vt-c-yellow);
  color: var(--vt-c-black);
  margin-top: 10px;
}
</style>
