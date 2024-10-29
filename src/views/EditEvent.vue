<!-- src/views/EditEvent.vue -->
<template>
    <div class="edit-event">
        <h1>Editar Evento</h1>
        <div v-if="loading">Cargando...</div>
        <EventForm v-else-if="event" :event="event" @submit="updateEvent" @cancel="goBack" />
        <div v-else>No se pudo cargar el evento.</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEventsStore } from '@/stores/events';
import EventForm from '@/components/Admin/EventForm.vue';

const router = useRouter();
const route = useRoute();
const eventsStore = useEventsStore();

const event = ref(null);
const loading = ref(true);

onMounted(async () => {
    const eventId = route.params.id;
    try {
        await eventsStore.fetchEventById(eventId);
        event.value = eventsStore.currentEvent;
    } catch (error) {
        console.error('Error fetching event:', error);
    } finally {
        loading.value = false;
    }
});

const updateEvent = async (updatedEvent) => {
    try {
        await eventsStore.updateEvent(updatedEvent.id, updatedEvent);
        router.push('/admin/events');
    } catch (error) {
        console.error('Error updating event:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando una notificación
    }
};

const goBack = () => {
    router.push('/admin/events');
};
</script>

<style scoped>
.edit-event {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}
</style>