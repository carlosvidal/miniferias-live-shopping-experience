<!-- src/views/AdminUserManagement.vue -->
<template>
    <div class="admin-user-management">
        <h1>Administración de Usuarios</h1>
        <UserManagementComponent />
    </div>
</template>

<script setup>
import UserManagementComponent from '@/components/Admin/UserManagement.vue';
</script>

<style scoped>
.admin-user-management {
    padding: 20px;
}
</style>