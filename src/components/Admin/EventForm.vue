<!-- src/components/Admin/EventForm.vue -->
<template>
    <form @submit.prevent="handleSubmit" class="event-form">
        <div>
            <label for="name">Nombre del Evento:</label>
            <input id="name" v-model="formData.name" required @input="generateSlug">
        </div>
        <div>
            <label for="slug">URL Slug:</label>
            <input id="slug" v-model="formData.slug" required>
        </div>
        <div>
            <label for="description">Descripción:</label>
            <textarea id="description" v-model="formData.description" required></textarea>
        </div>
        <div>
            <label for="startDate">Fecha de Inicio:</label>
            <input id="startDate" v-model="formData.startDate" type="datetime-local" required>
        </div>
        <div>
            <label for="endDate">Fecha de Fin:</label>
            <input id="endDate" v-model="formData.endDate" type="datetime-local" required>
        </div>
        <div>
            <label for="category">Categoría:</label>
            <input id="category" v-model="formData.category" required>
        </div>
        <div>
            <label for="coverImageUrl">URL de la Imagen de Portada:</label>
            <input id="coverImageUrl" v-model="formData.coverImageUrl" type="url">
        </div>
        <div class="form-actions">
            <button type="submit">{{ event ? 'Actualizar' : 'Crear' }} Evento</button>
            <button type="button" @click="$emit('cancel')">Cancelar</button>
        </div>
    </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    event: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
    name: '',
    slug: '',
    description: '',
    startDate: '',
    endDate: '',
    category: '',
    coverImageUrl: ''
});

onMounted(() => {
    if (props.event) {
        formData.value = {
            ...props.event,
            startDate: formatDateForInput(props.event.startDate),
            endDate: formatDateForInput(props.event.endDate)
        };
    }
});

const formatDateForInput = (date) => {
    return new Date(date).toISOString().slice(0, 16);
};

const generateSlug = () => {
    formData.value.slug = formData.value.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const handleSubmit = () => {
    emit('submit', {
        ...formData.value,
        startDate: new Date(formData.value.startDate),
        endDate: new Date(formData.value.endDate)
    });
};
</script>

<style scoped>
.event-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.event-form div {
    display: flex;
    flex-direction: column;
}

.event-form label {
    margin-bottom: 5px;
}

.event-form input,
.event-form textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.form-actions button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.form-actions button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

.form-actions button[type="button"] {
    background-color: #f44336;
    color: white;
}
</style>