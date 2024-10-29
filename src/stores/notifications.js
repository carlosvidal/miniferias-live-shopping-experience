// src/stores/notifications.js
import { defineStore } from "pinia";

export const useNotificationsStore = defineStore("notifications", {
  state: () => ({
    notifications: [],
  }),

  actions: {
    addNotification({ type, message, duration = 5000 }) {
      const id = Date.now();
      this.notifications.push({ id, type, message, duration });

      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, duration);
      }

      return id;
    },

    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    clearNotifications() {
      this.notifications = [];
    },

    success(message, duration) {
      return this.addNotification({ type: "success", message, duration });
    },

    error(message, duration) {
      return this.addNotification({ type: "error", message, duration });
    },

    info(message, duration) {
      return this.addNotification({ type: "info", message, duration });
    },

    warning(message, duration) {
      return this.addNotification({ type: "warning", message, duration });
    },
  },
});
