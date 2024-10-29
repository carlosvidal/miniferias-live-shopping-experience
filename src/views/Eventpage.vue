<!-- src/views/EventPage.vue -->
<template>
    <div v-if="loading">Cargando información del evento...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="event" class="event-page">
        <div class="event-cover">
            <img :src="event.coverImageUrl || 'https://via.placeholder.com/1200x400'" alt="Event cover"
                class="cover-photo">
            <h1 class="event-title">{{ event.name }}</h1>
        </div>
        <div class="event-details">
            <p>{{ event.description }}</p>
            <p>{{ formatDateRange(event.startDate, event.endDate) }}</p>
        </div>

        <div v-if="isEventLive" class="event-status live">
            ¡El evento está en vivo ahora!
        </div>
        <div v-else-if="isEventUpcoming" class="event-status upcoming">
            <p>El evento comenzará en:</p>
            <event-countdown :targetDate="event.startDate" />
        </div>
        <div v-else class="event-status ended">
            Este evento ha finalizado.
        </div>

        <h2>Stands participantes</h2>
        <div v-if="loadingBooths">Cargando stands...</div>
        <div v-else>
            <p>Número de participantes: {{ eventBooths.length }}</p>
            <div v-if="eventBooths.length === 0">No hay stands disponibles para este evento.</div>
            <div v-else class="booth-list">
                <div v-for="booth in eventBooths" :key="booth.id" class="booth-card">
                    <div class="booth-cover">
                        <img :src="booth.coverPhoto || 'https://via.placeholder.com/300x150'" alt="Booth cover"
                            class="cover-photo">
                    </div>
                    <div class="booth-content">
                        <img :src="booth.logo || 'https://via.placeholder.com/50'" alt="Booth logo" class="booth-logo">
                        <div class="booth-info">
                            <h3>{{ booth.name }}</h3>
                            <p>{{ booth.description }}</p>
                        </div>
                    </div>
                    <router-link :to="{
                        name: 'BoothPage',
                        params: {
                            identifier: event.slug || event.id,
                            boothId: booth.id
                        }
                    }" class="view-booth-btn" v-if="isEventLive">
                        Ver Stand
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div v-else>No se pudo cargar la información del evento.</div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { useBoothStore } from '../stores/booth'
import { useUsersStore } from '../stores/users'
import EventCountdown from '../components/Event/EventCountdown.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const boothStore = useBoothStore()
const usersStore = useUsersStore()

const eventIdentifier = computed(() => route.params.identifier)
const event = ref(null)
const loading = ref(true)
const loadingBooths = ref(true)
const error = ref(null)

const eventBooths = computed(() => {
    return boothStore.eventBooths.map(booth => {
        const seller = usersStore.getUserById(booth.sellerId);
        return {
            ...booth,
            logo: seller?.profilePicture || 'https://via.placeholder.com/50'
        };
    });
});

const isEventLive = computed(() => {
    if (!event.value || !event.value.startDate || !event.value.endDate) return false;
    const now = new Date();
    return now >= new Date(event.value.startDate) && now <= new Date(event.value.endDate);
});

const isEventUpcoming = computed(() => {
    if (!event.value || !event.value.startDate) return false
    return new Date() < new Date(event.value.startDate)
})

const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Fechas no disponibles'

    const formatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }

    const start = new Date(startDate).toLocaleString('es-ES', formatOptions)
    const end = new Date(endDate).toLocaleString('es-ES', formatOptions)

    return `Del ${start} al ${end}`
}

const loadEventData = async () => {
    loading.value = true
    loadingBooths.value = true
    error.value = null
    try {
        console.log('Fetching event with identifier:', eventIdentifier.value)
        await eventsStore.fetchEventByIdentifier(eventIdentifier.value)
        event.value = eventsStore.currentEvent
        console.log('Fetched event:', event.value)

        if (event.value) {
            console.log('Fetching event booths')
            await boothStore.fetchBoothsByEventId(event.value.id)
            await usersStore.fetchUsers()
            console.log('Fetched booths:', eventBooths.value)
        } else {
            console.log('Event not found')
            router.push({ name: 'NotFound' })
        }
    } catch (err) {
        console.error('Error fetching event details:', err)
        error.value = 'Error al cargar los detalles del evento. Por favor, intente de nuevo.'
    } finally {
        loading.value = false
        loadingBooths.value = false
    }
}

onMounted(() => {
    console.log('EventPage mounted')
    loadEventData()
})

watch(eventIdentifier, () => {
    console.log('Event identifier changed, reloading data')
    loadEventData()
})

watch(
    () => event.value,
    (newEvent) => {
        if (newEvent) {
            document.title = `${newEvent.name} - Live Shopping Experience`
        }
    }
)
</script>

<style scoped>
.event-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.event-cover {
    position: relative;
    margin-bottom: 20px;
}

.cover-photo {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

.event-title {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.event-details {
    margin-bottom: 20px;
}

.event-status {
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    text-align: center;
}

.event-status.live {
    background-color: #4CAF50;
    color: white;
}

.event-status.upcoming {
    background-color: #2196F3;
    color: white;
}

.event-status.ended {
    background-color: #9E9E9E;
    color: white;
}

.booth-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

.booth-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.booth-cover {
    height: 150px;
    overflow: hidden;
}

.cover-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.booth-content {
    padding: 15px;
    display: flex;
    align-items: center;
    position: relative;
}

.booth-logo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
    position: absolute;
    top: -25px;
    z-index: 2;
    border: 1px solid;
}

.booth-info {
    flex-grow: 1;
}

.booth-info h3 {
    margin: 0 0 5px 0;
}

.booth-info p {
    margin: 0;
    font-size: 0.9em;
    color: #666;
}

.view-booth-btn {
    display: block;
    background-color: #4CAF50;
    color: white;
    text-align: center;
    padding: 10px;
    text-decoration: none;
    margin-top: auto;
}

.view-booth-btn:hover {
    background-color: #45a049;
}
</style>