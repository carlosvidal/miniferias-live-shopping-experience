// src/scripts/createTestEvents.mjs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { firebaseConfig } from "../services/firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const randomFutureDate = (startDays = 1, endDays = 60) => {
  const start = new Date();
  start.setDate(start.getDate() + startDays);
  const end = new Date();
  end.setDate(end.getDate() + endDays);
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const generateTestEvents = (count) => {
  const events = [];
  const categories = [
    "Tecnología",
    "Moda",
    "Gastronomía",
    "Artesanía",
    "Deportes y Fitness",
    "Hogar",
    "Belleza",
    "Entretenimiento",
    "Educación",
    "Negocios",
  ];
  const locations = [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Cancún",
    "Puebla",
    "Tijuana",
    "Mérida",
    "Oaxaca",
    "Querétaro",
    "León",
  ];

  for (let i = 1; i <= count; i++) {
    const startDate = randomFutureDate();
    const endDate = new Date(
      startDate.getTime() + Math.random() * (7 * 24 * 60 * 60 * 1000)
    ); // Hasta 7 días después

    events.push({
      name: `Evento de Prueba ${i}`,
      description: `Descripción del evento de prueba ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      startDate,
      endDate,
    });
  }
  return events;
};

const testEvents = generateTestEvents(20);

async function createTestEvents() {
  try {
    for (const event of testEvents) {
      const eventData = {
        ...event,
        startDate: Timestamp.fromDate(event.startDate),
        endDate: Timestamp.fromDate(event.endDate),
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "events"), eventData);
      console.log("Evento creado con ID: ", docRef.id);
    }
    console.log("Todos los eventos de prueba han sido creados exitosamente.");
  } catch (error) {
    console.error("Error al crear los eventos de prueba: ", error);
  }
}

createTestEvents();
