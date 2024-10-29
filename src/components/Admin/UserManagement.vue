<!-- src/components/Admin/UserManagement.vue -->
<template>
    <div class="user-management">
        <h2>Gestión de Usuarios</h2>
        <button @click="showAddUserModal = true" class="add-btn">Añadir Usuario</button>

        <table v-if="users.length">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <select v-model="user.role" @change="updateUserRole(user)">
                            <option value="visitor">Visitante</option>
                            <option value="seller">Vendedor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </td>
                    <td>
                        <button @click="viewUserDetails(user)">Ver Detalles</button>
                        <button @click="openEditUserModal(user)">Editar</button>
                        <button @click="deleteUser(user.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <Modal v-model="showAddUserModal">
            <h3>Añadir Nuevo Usuario</h3>
            <form @submit.prevent="addUser">
                <input v-model="newUser.name" placeholder="Nombre" required>
                <input v-model="newUser.email" type="email" placeholder="Email" required>
                <input v-model="newUser.password" type="password" placeholder="Contraseña" required>
                <select v-model="newUser.role">
                    <option value="visitor">Visitante</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                </select>
                <button type="submit">Añadir Usuario</button>
            </form>
        </Modal>

        <Modal v-model="showEditUserModal">
            <h3>Editar Usuario</h3>
            <form v-if="editingUser" @submit.prevent="updateUser">
                <input v-model="editingUser.name" placeholder="Nombre" required>
                <input v-model="editingUser.email" type="email" placeholder="Email" required>
                <select v-model="editingUser.role">
                    <option value="visitor">Visitante</option>
                    <option value="seller">Vendedor</option>
                    <option value="admin">Administrador</option>
                </select>
                <button type="submit">Actualizar Usuario</button>
            </form>
        </Modal>

        <Modal v-model="showUserDetailsModal">
            <UserDetails v-if="selectedUser" :user="selectedUser" @close="showUserDetailsModal = false"
                @edit="openEditUserModal(selectedUser)" />
        </Modal>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import Modal from '@/components/Common/Modal.vue'
import UserDetails from '@/components/Admin/UserDetails.vue'

const usersStore = useUsersStore()
const users = ref([])
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showUserDetailsModal = ref(false)
const newUser = ref({ name: '', email: '', password: '', role: 'visitor' })
const editingUser = ref(null)
const selectedUser = ref(null)

onMounted(async () => {
    await usersStore.fetchUsers()
    users.value = usersStore.users
})

const addUser = async () => {
    await usersStore.addUser(newUser.value)
    showAddUserModal.value = false
    newUser.value = { name: '', email: '', password: '', role: 'visitor' }
    await refreshUsers()
}

const openEditUserModal = (user) => {
    editingUser.value = { ...user }
    showEditUserModal.value = true
}

const updateUser = async () => {
    if (editingUser.value) {
        await usersStore.updateUser(editingUser.value)
        showEditUserModal.value = false
        await refreshUsers()
    }
}

const updateUserRole = async (user) => {
    await usersStore.updateUser(user)
    await refreshUsers()
}

const deleteUser = async (userId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        await usersStore.deleteUser(userId)
        await refreshUsers()
    }
}

const viewUserDetails = (user) => {
    selectedUser.value = user
    showUserDetailsModal.value = true
}

const refreshUsers = async () => {
    await usersStore.fetchUsers()
    users.value = usersStore.users
}
</script>

<style scoped>
.user-management {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

button {
    margin-right: 5px;
    padding: 5px 10px;
    cursor: pointer;
}

.add-btn {
    margin-bottom: 10px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input,
select {
    padding: 5px;
}
</style>