<!-- src/views/EventList.vue -->
<template>
    <div class="event-list">
        <h1>Lista de Eventos</h1>
        <div v-if="loading">Cargando eventos...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else-if="activeAndUpcomingEvents.length === 0">No hay eventos disponibles en este momento.</div>
        <div v-else class="events-grid">
            <EventCard v-for="event in activeAndUpcomingEvents" :key="event.id" :event="event"
                :participantCount="getEventParticipantCount(event.id)" :eventSellers="getEventSellers(event.id)"
                :additionalParticipantsCount="getAdditionalParticipantsCount(event.id)" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEventsStore } from '@/stores/events'
import { useUsersStore } from '@/stores/users'
import { useBoothStore } from '@/stores/booth'
import EventCard from '@/components/Event/EventCard.vue'

const eventsStore = useEventsStore()
const usersStore = useUsersStore()
const boothStore = useBoothStore()
const loading = ref(true)
const error = ref(null)

const activeAndUpcomingEvents = computed(() => {
    const now = new Date()
    return eventsStore.events
        .filter(event => new Date(event.endDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
})

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

const getEventParticipantCount = (eventId) => {
    const booths = boothStore.allBooths.filter(booth => booth.eventIds && booth.eventIds.includes(eventId))
    return booths.length
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

onMounted(async () => {
    try {
        loading.value = true
        await Promise.all([
            eventsStore.fetchAllEvents(),
            usersStore.fetchUsers(),
            boothStore.fetchAllBooths()
        ])

        if (boothStore.allBooths.length === 0) {
            throw new Error('No se pudieron cargar los booths')
        }

        console.log('All data loaded successfully')
        console.log('Users:', usersStore.users)
        console.log('Events:', eventsStore.events)
        console.log('Booths:', boothStore.allBooths)
    } catch (err) {
        console.error('Error fetching data:', err)
        error.value = 'Error al cargar los datos. Por favor, intente de nuevo.'
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.event-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
</style>