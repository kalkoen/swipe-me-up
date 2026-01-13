<template>
    <div class="media" v-if="src" @click="mute = !mute">
        <img draggable="false" v-if="isImage(src)" :src="BASE_URL + src" :class="className" />
        <video :muted="mute" :autoplay="autoplay" :playsinline="autoplay" loop v-if="isVideo(src)" :class="className">
            <source :src="BASE_URL + src" type="video/mp4">
        </video>
        <sup v-if="isVideo(src)"><strong>&nbsp; (Press video to hear sound, if there is any)</strong></sup>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { BASE_URL } from '@/config/basePath'

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: '',
        required: false
    },
    autoplay: {
        type: Boolean,
        default: true,
        required: false
    }
})

const mute = ref(true)

function isImage(src) {
    src = src.toLowerCase()
    return src.endsWith('.jpg') || src.endsWith('.png') || src.endsWith('.jpeg')
}

function isVideo(src) {
    src = src.toLowerCase()
    return src.endsWith('.mp4')
}

</script>

<style scoped>
img,
video {
    width: 100%;
    height: auto;
}
</style>