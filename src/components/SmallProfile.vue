<template>
    <div class="small-profile">
        <div className="profile-pic" :style="{
            backgroundImage: `url(${BASE_URL}profiles/images/${profile.main_image})`,
            backgroundSize: 'cover',
        }"></div>

        <div class="profile-info">
            <h3 class="display-name">{{ profile.display_name }}</h3>
            <p class="association-type">{{ profile.description }}</p>
        </div>
    </div>
</template>

<script setup>
import MediaFile from './MediaFile.vue';

import { BASE_URL } from '@/config/basePath'


defineProps({
    profile: {
        type: Object,
        required: true,
    },
})
</script>

<style scoped>
.small-profile {
    padding: 10px;
    display: flex;
    align-items: center;
}

.profile-pic {
    min-width: 50px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    display: block;
    background-size: cover;
    border-radius: 50%;
}

.profile-info {
    display: flex;
    flex-direction: column;
}

.display-name {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
}

.association-type {
    margin: 0;
    font-size: 14px;
    color: gray;
}
</style>