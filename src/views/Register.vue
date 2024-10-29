<!-- src/views/Register.vue -->
<template>
    <div class="register">
        <h2>Registro</h2>
        <form @submit.prevent="handleRegister">
            <div class="form-group">
                <label for="name">Nombre</label>
                <input type="text" id="name" v-model="name" required>
            </div>
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div class="form-group">
                <label for="phoneNumber">Teléfono</label>
                <input type="tel" id="phoneNumber" v-model="phoneNumber" required>
            </div>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const phoneNumber = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
    loading.value = true
    error.value = ''
    try {
        await authStore.register(email.value, password.value, 'visitor', name.value, phoneNumber.value)
        router.push('/')
    } catch (err) {
        error.value = 'Error al registrarse. Por favor, inténtalo de nuevo.'
        console.error(err)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* ... (estilos sin cambios) ... */
</style>