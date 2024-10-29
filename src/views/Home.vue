<!-- src/views/Home.vue -->
<template>
    <div class="home">
        <h1>Bienvenido a Live Shopping Experience</h1>
        <div v-if="!isLoggedIn" class="auth-buttons">
            <router-link to="/login" class="btn">Iniciar Sesión</router-link>
            <router-link to="/register" class="btn">Registrarse</router-link>
        </div>
        <h2>Eventos Activos</h2>
        <div v-if="loading">Cargando eventos...</div>
        <div v-else-if="events.length === 0">No hay eventos activos en este momento.</div>
        <div v-else class="event-list">
            <EventCard v-for="event in events" :key="event.id" :event="event"
                :participantCount="getEventParticipantCount(event.id)" :eventSellers="getEventSellers(event.id)"
                :additionalParticipantsCount="getAdditionalParticipantsCount(event.id)" />
        </div>
        <p><router-link to="/events">Todos los eventos</router-link></p>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import { useBoothStore } from '../stores/booth'
import { useUsersStore } from '../stores/users'
import EventCard from '@/components/Event/EventCard.vue'

const authStore = useAuthStore()
const eventsStore = useEventsStore()
const boothStore = useBoothStore()
const usersStore = useUsersStore()
const loading = ref(true)

const isLoggedIn = computed(() => authStore.user !== null)
const events = computed(() => eventsStore.activeEvents)

const getEventParticipantCount = (eventId) => {
    const booths = boothStore.allBooths.filter(booth => booth.eventIds && booth.eventIds.includes(eventId))
    return booths.length
}

const getEventSellers = (eventId) => {
    const eventBooths = boothStore.allBooths.filter(booth => booth.eventIds && booth.eventIds.includes(eventId))
    let sellers = eventBooths.map(booth => {
        const seller = usersStore.getUserById(booth.sellerId)
        return seller ? {
            id: seller.id,
            name: seller.name,
            profilePicture: seller.profilePicture || 'https://via.placeholder.com/50'
        } : null
    }).filter(Boolean)

    if (sellers.length > 5) {
        sellers = shuffleArray(sellers).slice(0, 5)
    }

    return sellers
}

const getAdditionalParticipantsCount = (eventId) => {
    const totalParticipants = getEventParticipantCount(eventId)
    const shownParticipants = getEventSellers(eventId).length
    return Math.max(0, totalParticipants - shownParticipants)
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const fetchEvents = async () => {
    try {
        loading.value = true
        await Promise.all([
            eventsStore.fetchActiveEvents(),
            usersStore.fetchUsers(),
            boothStore.fetchAllBooths()
        ])
    } catch (error) {
        console.error('Error fetching events:', error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchEvents)
</script>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.auth-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 30px;
}

.event-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #45a049;
}
</style>