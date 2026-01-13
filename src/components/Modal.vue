<template>
    <Transition name="bounce">
        <div v-if="modal" id="modal">
            <div id="modal-content">
                <div id="modal-close-btn">
                    <img src="/images/nope.png" @click="$emit('close')" />
                </div>
                <component @close="$emit('close')" :is="modal" v-bind="$attrs" />
            </div>
        </div>
    </Transition>
</template>

<script>
export default {
    name: 'Modal',
    props: ['modal', 'props']
};
</script>

<style scoped>
#modal {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: calc(100% - 20px);
    height: 100%;
    min-width: 300px;
    max-width: 400px;
    margin: auto;
    z-index: 2;
    background: var(--color-background-soft);
    overflow: hidden;
}

#modal-content {
    padding: 10px;
    padding-top: 4em;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

#modal-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 3em;
    padding: 0px;
}

#modal-close-btn img {
    display: block;
    width: 100%;
    height: 100%;
}

.bounce-enter-active {
    animation: bounce-in 0.5s;
}

.bounce-leave-active {
    animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
    0% {
        transform: scale(0);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}
</style>