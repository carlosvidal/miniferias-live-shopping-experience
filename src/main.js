import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import "./style.css";
import App from "./App.vue";
import Modal from "@/components/Common/Modal.vue";

// Crear la instancia de la aplicación Vue
const app = createApp(App);

// Usar Pinia para el manejo del estado
app.use(createPinia());

// Usar Vue Router
app.use(router);
app.component("Modal", Modal);

// Montar la aplicación
app.mount("#app");
