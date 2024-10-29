<!-- src/components/Admin/LinkSellersToEvent.vue -->
<template>
    <div class="link-sellers-to-event">
        <h3>Vincular Vendedores al Evento: {{ event.name }}</h3>
        <div v-if="loading">Cargando vendedores y stands...</div>
        <div v-else-if="error">{{ error }}</div>
        <div v-else>
            <div v-for="seller in sellers" :key="seller.id" class="seller-item">
                <input type="checkbox" :id="seller.id" :value="seller.id" v-model="selectedSellers"
                    :disabled="!sellerHasBooth(seller.id)">
                <label :for="seller.id">
                    {{ seller.name }}
                    <span v-if="!sellerHasBooth(seller.id)">(Sin stand)</span>
                </label>
            </div>
            <div class="actions">
                <button @click="saveParticipants" :disabled="loading">Guardar</button>
                <button @click="$emit('close')">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useBoothStore } from '@/stores/booth';

const props = defineProps({
    event: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close']);

const usersStore = useUsersStore();
const boothStore = useBoothStore();

const sellers = ref([]);
const selectedSellers = ref([]);
const loading = ref(true);
const error = ref(null);

const eventBooths = computed(() => boothStore.eventBooths);

const sellerHasBooth = (sellerId) => {
    // Cambiamos esta función para verificar si el vendedor tiene un stand en general,
    // no solo en este evento específico
    return boothStore.allBooths.some(booth => booth.sellerId === sellerId);
};

onMounted(async () => {
    try {
        loading.value = true;
        await Promise.all([
            usersStore.fetchSellers(),
            boothStore.fetchAllBooths(), // Añadimos esta llamada para obtener todos los stands
            boothStore.fetchBoothsByEventId(props.event.id)
        ]);
        sellers.value = usersStore.sellers;
        selectedSellers.value = eventBooths.value.map(booth => booth.sellerId);
    } catch (err) {
        console.error('Error fetching data:', err);
        error.value = 'Error al cargar los datos. Por favor, intente de nuevo.';
    } finally {
        loading.value = false;
    }
});

const saveParticipants = async () => {
    try {
        loading.value = true;
        const currentParticipants = eventBooths.value;
        const boothsToRemove = currentParticipants.filter(
            booth => !selectedSellers.value.includes(booth.sellerId)
        );
        const sellersToAdd = selectedSellers.value.filter(
            sellerId => !currentParticipants.some(booth => booth.sellerId === sellerId)
        );

        for (const booth of boothsToRemove) {
            await boothStore.removeBoothFromEvent(booth.id, props.event.id);
        }

        for (const sellerId of sellersToAdd) {
            await boothStore.addBoothToEvent(sellerId, props.event.id);
        }

        emit('close');
    } catch (err) {
        console.error('Error saving participants:', err);
        error.value = 'Error al guardar los participantes. Por favor, intente de nuevo.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.link-sellers-to-event {
    padding: 20px;
}

.seller-item {
    margin-bottom: 10px;
}

.actions {
    margin-top: 20px;
}

button {
    margin-right: 10px;
    padding: 5px 10px;
    cursor: pointer;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>