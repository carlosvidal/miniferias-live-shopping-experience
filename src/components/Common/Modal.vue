<!-- src/components/Common/Modal.vue -->
<template>
    <Teleport to="body">
        <div v-if="modelValue" class="modal-overlay" @click="close">
            <div class="modal-content" @click.stop>
                <button class="close-button" @click="close">&times;</button>
                <slot></slot>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
    emit('update:modelValue', false);
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--modal-background);
    color: var(--modal-text);
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--modal-text);
}
</style>