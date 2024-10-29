<!-- src/views/BoothPage.vue -->
<template>
    <div class="booth-page">
        <div v-if="loading">Cargando información del stand...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="booth && event">
            <div class="navigation-bar">
                <button @click="goBack" class="nav-button">← Volver</button>
                <router-link :to="{ name: 'EventPage', params: { id: eventId } }" class="event-name">
                    {{ event.name }}
                </router-link>
                <router-link :to="nextBoothLink" class="nav-button">
                    Siguiente Stand →
                </router-link>
            </div>

            <div class="booth-cover">
                <img :src="booth.coverPhoto || 'https://via.placeholder.com/1200x400'" alt="Booth cover"
                    class="cover-photo">
                <img :src="booth.logo || 'https://via.placeholder.com/150'" alt="Booth logo" class="booth-logo">
            </div>
            <h1>{{ booth.name }}</h1>
            <p>{{ booth.description }}</p>
            <p>Categoría: {{ booth.category }}</p>

            <div class="seller-widget">
                <img :src="booth.seller?.profilePicture || 'https://via.placeholder.com/50'" alt="Seller profile"
                    class="seller-profile-pic">
                <div class="seller-info">
                    <h3>Vendedor</h3>
                    <p>{{ booth.seller?.name || 'Nombre no disponible' }}</p>
                </div>
            </div>

            <h2>Productos</h2>
            <product-list :sellerId="booth.sellerId" />
        </div>
        <div v-else>No se encontró información del stand.</div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBoothStore } from '@/stores/booth';
import { useUsersStore } from '@/stores/users';
import { useEventsStore } from '@/stores/events';

const route = useRoute();
const router = useRouter();
const boothStore = useBoothStore();
const usersStore = useUsersStore();
const eventsStore = useEventsStore();

const boothId = computed(() => route.params.boothId);
const eventIdentifier = computed(() => route.params.identifier);

const loading = ref(true);
const error = ref(null);

const booth = computed(() => {
    const boothData = boothStore.currentBooth;
    if (boothData) {
        const seller = usersStore.getUserById(boothData.sellerId);
        return { ...boothData, seller };
    }
    return null;
});

const event = computed(() => eventsStore.currentEvent);

const eventBooths = computed(() => boothStore.eventBooths);

const nextBoothLink = computed(() => {
    if (!eventBooths.value || eventBooths.value.length === 0) return '';

    const currentIndex = eventBooths.value.findIndex(b => b.id === boothId.value);
    if (currentIndex === -1) return '';

    const nextIndex = (currentIndex + 1) % eventBooths.value.length;
    const nextBooth = eventBooths.value[nextIndex];

    return {
        name: 'BoothPage',
        params: {
            identifier: eventIdentifier.value,
            boothId: nextBooth.id
        }
    };
});

const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
        console.log('Fetching booth details for ID:', boothId.value, 'and event identifier:', eventIdentifier.value);
        await Promise.all([
            boothStore.fetchBoothDetails(boothId.value),
            usersStore.fetchUsers(),
            eventsStore.fetchEventByIdentifier(eventIdentifier.value),
            boothStore.fetchBoothsByEventId(event.value.id)
        ]);
        console.log('Fetched booth details:', booth.value);
        console.log('Fetched event details:', event.value);
        console.log('Fetched event booths:', eventBooths.value);

        if (!booth.value || !event.value) {
            throw new Error('No se pudo cargar la información del stand o del evento');
        }

        // Verificar si el booth pertenece al evento
        if (!booth.value.eventIds.includes(event.value.id)) {
            throw new Error('Este stand no pertenece al evento especificado');
        }

        // Verificar si el evento está en curso
        const now = new Date();
        if (now < new Date(event.value.startDate) || now > new Date(event.value.endDate)) {
            router.push({ name: 'EventPage', params: { identifier: eventIdentifier.value } });
            return;
        }
    } catch (e) {
        console.error('Error fetching data:', e);
        error.value = e.message;
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.go(-1);
};

onMounted(fetchData);

watch([boothId, eventIdentifier], fetchData);
</script>

<style scoped>
.booth-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.booth-cover {
    position: relative;
    margin-bottom: 20px;
}

.cover-photo {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

.booth-logo {
    position: absolute;
    bottom: -50px;
    left: 20px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 5px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1,
h2,
h3 {
    color: #333;
}

h1 {
    font-size: 2.5em;
    margin-bottom: 20px;
    margin-top: 60px;
}

h2 {
    font-size: 1.5em;
    margin-bottom: 15px;
}

.seller-widget {
    display: flex;
    align-items: center;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.seller-profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
}

.seller-info {
    flex-grow: 1;
}

.seller-info h3 {
    margin: 0;
    font-size: 1em;
    color: #666;
}

.seller-info p {
    margin: 5px 0 0;
    font-weight: bold;
}

.navigation-links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.nav-button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.nav-button:hover {
    background-color: #45a049;
}

.navigation-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    border-radius: 4px;
}

.event-name {
    font-size: 1.2em;
    font-weight: bold;
    margin: 0;
    text-align: center;
    flex-grow: 1;
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
}

.event-name:hover {
    color: #4CAF50;
}

.nav-button {
    padding: 10px 15px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    white-space: nowrap;
}

.nav-button:hover {
    background-color: #45a049;
}
</style>