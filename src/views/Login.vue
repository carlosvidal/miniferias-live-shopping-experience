<!-- src/views/Login.vue -->
<template>
    <div class="login">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div class="form-group">
                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p>¿No tienes una cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
    loading.value = true
    error.value = ''
    try {
        await authStore.login(email.value, password.value)
        router.push('/')
    } catch (err) {
        error.value = 'Error al iniciar sesión. Por favor, verifica tus credenciales.'
        console.error(err)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* ... (estilos sin cambios) ... */
</style>