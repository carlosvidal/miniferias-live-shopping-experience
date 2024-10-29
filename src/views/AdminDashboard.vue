<!-- src/views/AdminDashboard.vue -->
<template>
    <div class="admin-dashboard">
        <h1>Panel de Administración</h1>
        <div v-if="loading">Cargando datos del dashboard...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else class="dashboard-stats">
            <div class="stat-card">
                <h3>Total Usuarios</h3>
                <p>{{ totalUsers }}</p>
            </div>
            <div class="stat-card">
                <h3>Total Eventos</h3>
                <p>{{ totalEvents }}</p>
            </div>
            <div class="stat-card">
                <h3>Eventos Activos</h3>
                <p>{{ activeEvents }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useEventsStore } from '@/stores/events';

const usersStore = useUsersStore();
const eventsStore = useEventsStore();

const loading = ref(true);
const error = ref(null);

const totalUsers = computed(() => usersStore.users.length);
const totalEvents = computed(() => eventsStore.events.length);
const activeEvents = computed(() => {
    const now = new Date();
    return eventsStore.events.filter(event =>
        new Date(event.startDate) <= now && new Date(event.endDate) >= now
    ).length;
});

onMounted(async () => {
    try {
        loading.value = true;
        await Promise.all([
            usersStore.fetchUsers(),
            eventsStore.fetchAllEvents()
        ]);
    } catch (err) {
        console.error('Error loading dashboard data:', err);
        error.value = 'Error al cargar los datos del dashboard. Por favor, intenta de nuevo.';
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.admin-dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.dashboard-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
}

.stat-card {
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    flex: 1;
    margin: 0 10px;
}

.stat-card h3 {
    margin-bottom: 10px;
    color: #333;
}

.stat-card p {
    font-size: 24px;
    font-weight: bold;
    color: #4CAF50;
}

.dashboard-actions {
    margin-top: 30px;
}

.dashboard-actions h2 {
    margin-bottom: 10px;
}

.admin-button {
    display: inline-block;
    padding: 10px 20px;
    margin: 10px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.admin-button:hover {
    background-color: #45a049;
}

.error-message {
    color: red;
    margin-bottom: 20px;
}
</style>