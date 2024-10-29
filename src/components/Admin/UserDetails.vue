<!-- src/components/Admin/UserDetails.vue -->
<template>
    <div class="user-details">
        <img :src="user.profilePicture || 'https://via.placeholder.com/150'" alt="Profile picture"
            class="profile-picture">
        <h3>Detalles del Usuario</h3>
        <p><strong>Nombre:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Rol:</strong> {{ user.role }}</p>
        <p><strong>Categoría:</strong> {{ user.category || 'No especificada' }}</p>
        <p><strong>Descripción:</strong> {{ user.description || 'No especificada' }}</p>
        <p><strong>Ubicación:</strong> {{ user.location || 'No especificada' }}</p>
        <p><strong>Teléfono:</strong> {{ user.phoneNumber || 'No especificado' }}</p>
        <p><strong>Fecha de Registro:</strong> {{ formatDate(user.createdAt) }}</p>
        <button @click="$emit('edit')">Editar Usuario</button>
        <button @click="$emit('close')">Cerrar</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

defineEmits(['close', 'edit']);

const formatDate = (date) => {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleString();
};
</script>

<style scoped>
.user-details {
    padding: 20px;
    color: var(--text-color);
}

.profile-picture {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
}

button {
    margin-top: 20px;
    padding: 10px 15px;
    background-color: var(--button-background);
    color: var(--button-text);
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>