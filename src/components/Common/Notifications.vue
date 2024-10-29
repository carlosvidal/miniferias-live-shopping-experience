<!-- src/components/Common/Notifications.vue -->
<template>
    <div class="notifications">
        <div v-for="notification in notifications" :key="notification.id" class="notification"
            :class="notification.type">
            {{ notification.message }}
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useNotificationsStore } from '../../stores/notifications';

export default defineComponent({
    name: 'Notifications',
    setup() {
        const notificationStore = useNotificationsStore();

        return {
            notifications: notificationStore.notifications
        };
    }
});
</script>

<style scoped>
.notifications {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.notification {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    color: white;
}

.notification.success {
    background-color: #4caf50;
}

.notification.error {
    background-color: #f44336;
}

.notification.info {
    background-color: #2196f3;
}
</style>