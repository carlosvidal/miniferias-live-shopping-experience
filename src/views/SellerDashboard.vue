<!-- src/views/SellerDashboard.vue -->
<template>
    <div class="seller-dashboard">
        <h1>Panel de Vendedor</h1>
        <div v-if="!currentUser">Cargando información del usuario...</div>
        <div v-else class="dashboard-content">
            <div class="section">
                <h2>Mis Productos</h2>
                <ProductCatalog :sellerId="currentUser.uid" />
            </div>
            <!-- Otras secciones del dashboard -->
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import ProductCatalog from '@/components/Seller/ProductCatalog.vue';

const authStore = useAuthStore();
const currentUser = computed(() => authStore.user);
</script>

<style scoped>
/* ... estilos ... */
</style>