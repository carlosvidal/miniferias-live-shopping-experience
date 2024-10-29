<!-- src/views/CreateEvent.vue -->
<template>
    <div class="create-event">
        <h1>Crear Nuevo Evento</h1>
        <EventForm @submit="createEvent" @cancel="goBack" />
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useEventsStore } from '@/stores/events';
import EventForm from '@/components/Admin/EventForm.vue';

const router = useRouter();
const eventsStore = useEventsStore();

const createEvent = async (newEvent) => {
    try {
        await eventsStore.createEvent(newEvent);
        router.push('/admin/events');
    } catch (error) {
        console.error('Error creating event:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando una notificación
    }
};

const goBack = () => {
    router.push('/admin/events');
};
</script>

<style scoped>
.create-event {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
</style>