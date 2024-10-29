<!-- src/components/Admin/AddUser.vue -->
<template>
    <div class="add-user">
        <h3>Añadir Nuevo Usuario</h3>
        <form @submit.prevent="handleSubmit">
            <div>
                <label for="name">Nombre:</label>
                <input id="name" v-model="formData.name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input id="email" v-model="formData.email" type="email" required>
            </div>
            <div>
                <label for="role">Rol:</label>
                <select id="role" v-model="formData.role" required>
                    <option value="user">Usuario</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div>
                <label for="category">Categoría:</label>
                <input id="category" v-model="formData.category">
            </div>
            <div>
                <label for="description">Descripción:</label>
                <textarea id="description" v-model="formData.description"></textarea>
            </div>
            <div>
                <label for="location">Ubicación:</label>
                <input id="location" v-model="formData.location">
            </div>
            <div>
                <label for="phoneNumber">Teléfono:</label>
                <input id="phoneNumber" v-model="formData.phoneNumber">
            </div>
            <div class="form-actions">
                <button type="submit">Crear Usuario</button>
                <button type="button" @click="$emit('cancel')">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
    name: '',
    email: '',
    role: 'user',
    category: '',
    description: '',
    location: '',
    phoneNumber: '',
});

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>

<style scoped>
form {
    color: var(--text-color);
}

input,
select,
textarea {
    background-color: var(--input-background);
    color: var(--input-text);
    border: 1px solid var(--text-color);
}

button {
    background-color: var(--button-background);
    color: var(--button-text);
}
</style>