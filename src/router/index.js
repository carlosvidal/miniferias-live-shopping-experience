// src/router/index.js

import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useEventsStore } from "../stores/events";

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    meta: { title: "Inicio - Live Shopping Experience" },
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
    meta: { title: "Iniciar Sesión - Live Shopping Experience" },
  },
  {
    path: "/register",
    component: () => import("../views/Register.vue"),
    meta: { title: "Registrarse - Live Shopping Experience" },
  },
  {
    path: "/admin",
    component: () => import("../views/AdminDashboard.vue"),
    meta: {
      title: "Panel de Administración - Live Shopping Experience",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/users",
    component: () => import("../views/AdminUserManagement.vue"),
    meta: {
      title: "Gestión de Usuarios - Live Shopping Experience",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/events",
    component: () => import("../views/AdminEventManagement.vue"),
    meta: {
      title: "Gestión de Eventos - Live Shopping Experience",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/events/create",
    component: () => import("../views/CreateEvent.vue"),
    meta: {
      title: "Crear Evento - Live Shopping Experience",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/events/edit/:id",
    component: () => import("../views/EditEvent.vue"),
    meta: {
      title: "Editar Evento - Live Shopping Experience",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/seller",
    component: () => import("../views/SellerDashboard.vue"),
    meta: {
      title: "Panel de Vendedor - Live Shopping Experience",
      requiresAuth: true,
      requiresSeller: true,
    },
  },
  {
    path: "/events",
    component: () => import("../views/EventList.vue"),
    meta: { title: "Eventos - Live Shopping Experience" },
  },
  {
    path: "/event/:identifier",
    name: "EventPage",
    component: () => import("../views/EventPage.vue"),
    meta: { title: "Detalles del Evento - Live Shopping Experience" },
  },
  {
    path: "/event/:identifier/booth/:boothId",
    name: "BoothPage",
    component: () => import("../views/BoothPage.vue"),
    props: true,
    meta: { title: "Stand - Live Shopping Experience" },
    beforeEnter: async (to, from, next) => {
      const eventsStore = useEventsStore();
      await eventsStore.fetchEventByIdentifier(to.params.identifier);
      const event = eventsStore.currentEvent;

      if (!event) {
        next({ name: "NotFound" });
        return;
      }

      const now = new Date();
      if (now < new Date(event.startDate) || now > new Date(event.endDate)) {
        next({
          name: "EventPage",
          params: { identifier: to.params.identifier },
        });
        return;
      }

      next();
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Asegúrate de que el usuario esté autenticado y que se haya cargado su rol
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const requiresSeller = to.matched.some(
    (record) => record.meta.requiresSeller
  );

  if (requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (requiresAdmin && !authStore.isAdmin) {
    next("/");
  } else if (requiresSeller && !authStore.isSeller) {
    next("/");
  } else {
    next();
  }
});

export default router;
