<template>
    <div class="profile" ref="profilediv">
        <!-- <div class=" mainpic" :style="{
            'background-image': `url(profiles/images/${profile.main_image})`
        }" /> -->
        <p v-if="profile.parent" class="premessage">Because you liked <strong>{{ profile.parent }}</strong>:</p>
        <MediaFile :src="'profiles/images/' + profile.main_image" class="mainpic" />
        <div class="text">
            <h3>{{ profile.display_name }}</h3>
            <span class="emoji">{{ profile.emoji }}</span> {{ profile.description }} <br>
            <div v-if="profile.adjectives">
                <span class="emoji">✨</span>
                {{ profile.adjectives }}<br>
            </div>
            <sup v-if="profile.year"> Established in {{ profile.year }}</sup>
        </div>
        <div class="text">
            {{ profile.story }}
        </div>

        <div class="blocks" v-for="(block, index) in profile.blocks">
            <div class="text">
                <h3 v-if="block.heading != '(No heading)'">{{ block.heading }}</h3>
                <p>{{ block.content }}</p>
            </div>
            <MediaFile :src="'profiles/images/' + profile.images[index]" class="pic"></MediaFile>
        </div>

        <div class="blocks" v-for="(image, index) in profile.images.slice(profile.blocks.length)">
            <MediaFile :src="'profiles/images/' + image" className="pic"></MediaFile>
        </div>


        <div v-if="profile.member" class="member">
            <MediaFile :src="'profiles/images/' + profile.member.images[0]" class="main-member-pic" />

            <div class="blocks text">
                <h3>{{ profile.member.name }}</h3>
                <p v-if="profile.member.role">{{ profile.member.role }}</p>
                <sup v-if="profile.member.since"><em>Member since {{ profile.member.since }}</em></sup> <br>
                <p>{{ profile.member.story }}</p>
            </div>

            <div v-if="profile.member.images" v-for="(image, index) in profile.member.images.slice(1)">
                <MediaFile :src="'profiles/images/' + image" class="pic"></MediaFile>
            </div>

        </div>

    </div>

    <button class="scroll-down-btn" @click="scrollDown(300)">
        <img class="svg" src="/images/down-arrow-icon.svg" alt="Icon" />
    </button>


    <!-- <div class="pic" :style="{
            'background-image': `url(profiles/images/${profile.images[1]})`
        }" /> -->
    <!-- </div> -->
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import MediaFile from './MediaFile.vue';

const props = defineProps(['profile'])

const mute = ref(Object.fromEntries(props.profile.images.map(x => [x, true])))

const profilediv = useTemplateRef('profilediv')

function scrollDown(offset = 100) {
    profilediv.value.scrollTo({
        top: profilediv.value.scrollTop + offset,
        behavior: 'smooth'
    })

}
</script>

<style scoped>
.profile {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch !important;

    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}

.blocks {
    width: 100%;
    margin-bottom: 10px;
}

.person {
    width: 100%;
    margin-bottom: 10px;
}


.mainpic {
    /* max-height: 70vh; */
    /* background-size: cover;
    background-position: center; */
}


.pic {
    width: 100%;
    height: auto;
    display: block;
    /* height: 300px; */
    /* background-size: cover;
    background-position: center; */

    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
}

.main-member-pic {
    width: 50%;
    height: auto;
    display: block;
    float: left;
    margin-right: 1em;
}

.text {
    padding: 10px;
}

.emoji {
    display: inline-block;
    width: 1.5em;
}

sup {
    display: block;
    margin-top: 0.4em;
}

.premessage {
    padding: 10px;
    font-style: italic
}

.scroll-down-btn {
    position: absolute;
    bottom: 0px;
    right: 0px;
    /* border: white solid 5px; */
    background-color: #FF6D00;
    border-radius: 5px;
    width: 50px;
    height: 50px;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    padding: 10px;
}

.scroll-down-btn .svg {
    filter: invert(1)
}

/* Chrome, Edge, Safari */
::-webkit-scrollbar {
    width: 20px;
}

::-webkit-scrollbar-track {
    background: #ffffff;
}

::-webkit-scrollbar-thumb {
    background-color: #FF6D00;
    border-radius: 15px;
    border: 3px solid #ffffff;
    /* creates padding around thumb */
}

::-webkit-scrollbar-button {
    width: 0;
    height: 0;
    display: none;
}

* {
    scrollbar-width: 15px;
    scrollbar-color: #FF6D00 #ffffff;
}

@supports selector(::-webkit-scrollbar) {
    * {
        scrollbar-width: unset;
        scrollbar-color: unset;
    }
}
</style>