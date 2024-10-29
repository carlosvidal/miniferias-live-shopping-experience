<!-- src/components/Admin/EventManagement.vue -->
<template>
    <div class="event-management">
        <h2>Gestión de Eventos</h2>
        <router-link to="/admin/events/create" class="add-event-btn">Agregar Nuevo Evento</router-link>

        <div v-if="loading">Cargando eventos...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
            <p>Número total de eventos: {{ events.length }}</p>
            <p>Número de eventos próximos y en curso: {{ upcomingAndOngoingEvents.length }}</p>
            <div v-if="upcomingAndOngoingEvents.length === 0">No hay eventos próximos o en curso.</div>
            <table v-else class="event-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="event in upcomingAndOngoingEvents" :key="event.id">
                        <td>
                            <router-link :to="{ name: 'EventPage', params: { identifier: event.slug || event.id } }">
                                {{ event.name }}
                            </router-link>
                        </td>
                        <td>{{ formatDate(event.startDate) }}</td>
                        <td>{{ formatDate(event.endDate) }}</td>
                        <td>{{ getEventStatus(event) }}</td>
                        <td>
                            <router-link :to="`/admin/events/edit/${event.id}`" class="icon-btn" title="Editar">
                                <i class="fas fa-pencil-alt"></i>
                            </router-link>
                            <button @click="linkSellers(event)" class="icon-btn" title="Vincular Vendedores">
                                <i class="fas fa-link"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal v-model="showLinkSellersModal">
            <LinkSellersToEvent :event="selectedEvent" @close="showLinkSellersModal = false" />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEventsStore } from '@/stores/events';
import Modal from '@/components/Common/Modal.vue';
import LinkSellersToEvent from '@/components/Admin/LinkSellersToEvent.vue';

const eventsStore = useEventsStore();

const loading = ref(true);
const error = ref(null);
const showLinkSellersModal = ref(false);
const selectedEvent = ref(null);

const events = computed(() => eventsStore.events || []);

const upcomingAndOngoingEvents = computed(() => {
    const now = new Date();
    return events.value
        .filter(event => new Date(event.endDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
});

onMounted(async () => {
    try {
        loading.value = true;
        await eventsStore.fetchAllEvents();
    } catch (err) {
        console.error('Error fetching events:', err);
        error.value = 'Error al cargar los datos. Por favor, intente de nuevo.';
    } finally {
        loading.value = false;
    }
});

const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    return new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getEventStatus = (event) => {
    const now = new Date();
    if (now < new Date(event.startDate)) return 'Próximo';
    if (now > new Date(event.endDate)) return 'Finalizado';
    return 'En curso';
};

const linkSellers = (event) => {
    selectedEvent.value = event;
    showLinkSellersModal.value = true;
};
</script>

<style scoped>
.event-management {
    padding: 20px;
}

.add-event-btn {
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.event-table {
    width: 100%;
    border-collapse: collapse;
}

.event-table th,
.event-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.event-table th {
    background-color: #f2f2f2;
}

.icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
    margin-right: 10px;
    color: #4CAF50;
}

.icon-btn:hover {
    color: #45a049;
}

.add-event-btn {
    display: inline-block;
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
}

.add-event-btn:hover {
    background-color: #45a049;
}
</style>