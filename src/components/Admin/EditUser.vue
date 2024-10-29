<!-- src/components/Admin/EditUser.vue -->
<template>
    <div class="edit-user">
        <h3>Editar Usuario</h3>
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
                <select id="role" v-model="formData.role">
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
                <button type="submit">Actualizar Usuario</button>
                <button type="button" @click="$emit('cancel')">Cancelar</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({ ...props.user });

const handleSubmit = () => {
    emit('submit', formData.value);
};
</script>

<style scoped>
.edit-user-role {
    padding: 20px;
}

form {
    margin-top: 20px;
}

select {
    margin-top: 5px;
    padding: 5px;
    width: 100%;
}

.form-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

button {
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button[type="submit"] {
    background-color: #4CAF50;
    color: white;
}

button[type="button"] {
    background-color: #f44336;
    color: white;
}

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