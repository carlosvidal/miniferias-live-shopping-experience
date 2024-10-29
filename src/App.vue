<!-- src/App.vue -->
<template>
  <header>
    <nav>
      <button @click="toggleLeftWardrobe" class="icon-button">
        <i class="fas fa-bars"></i>
      </button>
      <router-link to="/" class="logo">
        <img src="@/assets/logoipsum-332.svg" alt="Logo" />
      </router-link>
      <button @click="toggleRightWardrobe" class="icon-button">
        <i class="fas fa-shopping-cart"></i>
      </button>
    </nav>
  </header>

  <main>
    <router-view></router-view>
  </main>

  <footer>
    <p>&copy; {{ currentYear }} Tu Plataforma de Live Shopping. Todos los derechos reservados.</p>
  </footer>

  <!-- Left Wardrobe -->
  <div class="wardrobe left" :class="{ 'open': isLeftWardrobeOpen }">
    <button @click="toggleLeftWardrobe" class="close-button">&times;</button>
    <nav>
      <template v-if="isLoggedIn">
        <template v-if="isAdmin">
          <router-link to="/admin" @click="closeLeftWardrobe">Dashboard</router-link>
          <router-link to="/admin/users" @click="closeLeftWardrobe">Usuarios</router-link>
          <router-link to="/admin/events" @click="closeLeftWardrobe">Eventos</router-link>
        </template>
        <router-link to="/seller" v-if="isSeller" @click="closeLeftWardrobe">Panel de Vendedor</router-link>
        <router-link to="/events" @click="closeLeftWardrobe">Eventos</router-link>
        <a href="#" @click.prevent="handleLogout">Cerrar Sesión</a>
      </template>
      <template v-else>
        <router-link to="/login" @click="closeLeftWardrobe">Iniciar Sesión</router-link>
        <router-link to="/register" @click="closeLeftWardrobe">Registrarse</router-link>
        <router-link to="/events" @click="closeLeftWardrobe">Eventos</router-link>
      </template>
    </nav>
  </div>

  <!-- Right Wardrobe -->
  <div class="wardrobe right" :class="{ 'open': isRightWardrobeOpen }">
    <button @click="toggleRightWardrobe" class="close-button">&times;</button>
    <p>El carrito de compras se implementará pronto.</p>
  </div>

  <div class="wardrobe-overlay" v-if="isLeftWardrobeOpen || isRightWardrobeOpen" @click="closeWardrobes"></div>

  <Teleport to="body">
    <modal-container />
  </Teleport>

  <notifications />
</template>

<script setup>
import { computed, onMounted, provide, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Notifications from './components/Common/Notifications.vue'
import Modal from '@/components/Common/Modal.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const isLoggedIn = computed(() => authStore.isAuthenticated)
const isSeller = computed(() => authStore.isSeller)
const isAdmin = computed(() => authStore.isAdmin)
const currentYear = computed(() => new Date().getFullYear())

const isLeftWardrobeOpen = ref(false)
const isRightWardrobeOpen = ref(false)

const toggleLeftWardrobe = () => {
  isLeftWardrobeOpen.value = !isLeftWardrobeOpen.value
  if (isLeftWardrobeOpen.value) isRightWardrobeOpen.value = false
}

const toggleRightWardrobe = () => {
  isRightWardrobeOpen.value = !isRightWardrobeOpen.value
  if (isRightWardrobeOpen.value) isLeftWardrobeOpen.value = false
}

const closeLeftWardrobe = () => {
  isLeftWardrobeOpen.value = false
}

const closeWardrobes = () => {
  isLeftWardrobeOpen.value = false
  isRightWardrobeOpen.value = false
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    closeLeftWardrobe()
    router.push('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    // Aquí podrías mostrar una notificación de error
  }
}

const isModalOpen = ref(false)

const openModal = () => {
  isModalOpen.value = true
}

const toggleModal = () => {
  isModalOpen.value = !isModalOpen.value
}

const closeModal = () => {
  isModalOpen.value = false
}

watch(
  () => route.meta,
  (meta) => {
    if (meta.title) {
      document.title = meta.title
    }
  },
  { immediate: true }
)

onMounted(async () => {
  // Verificar el estado de autenticación al cargar la aplicación
  try {
    await authStore.fetchUser()
  } catch (error) {
    console.error('Error al recuperar la sesión del usuario:', error)
  }
})

// Proporcionar el store de autenticación a todos los componentes hijos
provide('authStore', authStore)
</script>

<!-- App.vue -->
<style>
:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --modal-background: #ffffff;
  --modal-text: #333333;
  --input-background: #f0f0f0;
  --input-text: #333333;
  --button-background: #4CAF50;
  --button-text: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #1a1a1a;
    --text-color: #ffffff;
    --modal-background: #2c2c2c;
    --modal-text: #ffffff;
    --input-background: #3a3a3a;
    --input-text: #ffffff;
    --button-background: #45a049;
    --button-text: #ffffff;
  }
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
}



#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  background-color: white;
  width: 100%;
}

header {
  background-color: #34495e;
  color: white;
}

nav {
  display: flex;
  justify-content: space-around;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover,
nav a.router-link-active {}



main {
  flex: 1;
}

footer {
  background-color: #34495e;
  color: white;
  text-align: center;
  padding: 1rem;
}

header nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #34495e;
}

.icon-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

header nav .logo {
  padding: 0;
}

header nav .logo img {
  padding: 0;
  display: block;
}

.wardrobe {
  position: fixed;
  top: 0;
  height: 100%;
  width: 250px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.wardrobe.left {
  left: 0;
  transform: translateX(-100%);
}

.wardrobe.right {
  right: 0;
  transform: translateX(100%);
}

.wardrobe.open {
  transform: translateX(0);
}

.wardrobe .close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.wardrobe nav {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.wardrobe nav a {
  margin-bottom: 10px;
  color: #34495e;
  text-decoration: none;
}

.wardrobe-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
</style>