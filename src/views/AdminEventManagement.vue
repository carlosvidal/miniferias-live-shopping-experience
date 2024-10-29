<!-- src/views/AdminEventManagement.vue -->
<template>
    <div class="admin-event-management">
        <h1>Administración de Eventos</h1>
        <EventManagementComponent />
    </div>
</template>

<script setup>
import EventManagementComponent from '@/components/Admin/EventManagement.vue';
</script>

<style scoped>
.admin-event-management {
    padding: 20px;
}
</style>