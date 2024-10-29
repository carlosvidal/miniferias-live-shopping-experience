<!-- src/components/Event/EventCard.vue -->
<template>
    <div class="event-card" :class="{ 'event-active': isEventActive }">
        <div class="event-cover">
            <img :src="event.coverImageUrl || 'https://via.placeholder.com/400x200'" alt="Event cover"
                class="cover-photo">
        </div>
        <div class="event-content">
            <h2>{{ event.name }}</h2>
            <p>{{ event.description }}</p>
            <p>Inicio: {{ formatDate(event.startDate) }}</p>
            <p>Fin: {{ formatDate(event.endDate) }}</p>
            <p>Vendedores participantes: {{ participantCount }}</p>
            <p class="event-status">{{ eventStatus }}</p>
            <div class="seller-avatars">
                <div v-if="additionalParticipantsCount > 0" class="additional-participants">
                    +{{ additionalParticipantsCount }}
                </div>
                <div v-for="seller in eventSellers" :key="seller.id" class="seller-avatar-container">
                    <img :src="seller.profilePicture || 'https://via.placeholder.com/50'" :alt="seller.name"
                        class="seller-avatar" :title="seller.name">
                </div>
            </div>
            <router-link :to="{ name: 'EventPage', params: { identifier: event.slug || event.id } }"
                class="view-event-btn">
                Ver Evento
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    event: {
        type: Object,
        required: true
    },
    participantCount: {
        type: Number,
        default: 0
    },
    eventSellers: {
        type: Array,
        default: () => []
    },
    additionalParticipantsCount: {
        type: Number,
        default: 0
    }
});

const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const isEventActive = computed(() => {
    const now = new Date();
    return now >= new Date(props.event.startDate) && now <= new Date(props.event.endDate);
});

const eventStatus = computed(() => {
    const now = new Date();
    if (now < new Date(props.event.startDate)) return 'Próximo';
    if (now > new Date(props.event.endDate)) return 'Finalizado';
    return 'En curso';
});
</script>

<style scoped>
.event-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
}

.event-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.event-active {
    border-color: #4CAF50;
}

.event-cover {
    height: 200px;
    overflow: hidden;
}

.cover-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.event-content {
    padding: 15px;
}

.event-status {
    font-weight: bold;
    color: #4CAF50;
}

.seller-avatars {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    width: fit-content;
    margin: 10px auto;
    padding-left: 15px;
}

.seller-avatar-container {
    margin-left: -15px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.seller-avatar-container:hover {
    transform: translateY(-5px);
}

.seller-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    display: block;
}

.view-event-btn {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 15px;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 10px;
}

.view-event-btn:hover {
    background-color: #45a049;
}

.additional-participants {
    margin-left: -15px;
    background-color: #f0f0f0;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: bold;
    color: #333;
    display: flex;
    text-align: center;
    width: 40px;
    height: 40px;
    padding: 0;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>