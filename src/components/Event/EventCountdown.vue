<!-- src/components/Event/EventCountdown.vue -->
<template>
    <div class="event-countdown">
        <template v-if="isCountdownActive">
            <div class="countdown-item">
                <span class="countdown-value">{{ days }}</span>
                <span class="countdown-label">Días</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">{{ hours }}</span>
                <span class="countdown-label">Horas</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">{{ minutes }}</span>
                <span class="countdown-label">Minutos</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value">{{ seconds }}</span>
                <span class="countdown-label">Segundos</span>
            </div>
        </template>
        <template v-else>
            <p>El evento ha comenzado</p>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
    targetDate: {
        type: Date,
        required: true
    }
});

const now = ref(new Date());
const interval = ref(null);

const timeRemaining = computed(() => {
    const difference = props.targetDate - now.value;
    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
});

const isCountdownActive = computed(() => props.targetDate > now.value);

const days = computed(() => timeRemaining.value.days.toString().padStart(2, '0'));
const hours = computed(() => timeRemaining.value.hours.toString().padStart(2, '0'));
const minutes = computed(() => timeRemaining.value.minutes.toString().padStart(2, '0'));
const seconds = computed(() => timeRemaining.value.seconds.toString().padStart(2, '0'));

const updateCountdown = () => {
    now.value = new Date();
};

onMounted(() => {
    updateCountdown();
    interval.value = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
    if (interval.value) clearInterval(interval.value);
});
</script>

<style scoped>
.event-countdown {
    display: flex;
    justify-content: center;
    gap: 20px;
    font-family: Arial, sans-serif;
}

.countdown-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.countdown-value {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
}

.countdown-label {
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
}
</style>