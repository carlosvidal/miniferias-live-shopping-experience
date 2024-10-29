// src/scripts/createTestBooths.mjs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../services/firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categories = [
  "Electrónica",
  "Moda",
  "Alimentación",
  "Artesanía",
  "Deportes y Fitness",
  "Hogar y Jardín",
  "Belleza y Cuidado Personal",
  "Juguetes y Juegos",
  "Libros y Papelería",
  "Mascotas",
];

async function getSellerIds() {
  const q = query(collection(db, "users"), where("role", "==", "seller"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.id);
}

async function createTestBooths() {
  try {
    const sellerIds = await getSellerIds();
    console.log("Número de sellers encontrados:", sellerIds.length);

    for (const sellerId of sellerIds) {
      const boothData = {
        name: `Booth de ${sellerId}`,
        description: `Descripción del booth de ${sellerId}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        sellerId: sellerId,
        eventIds: [],
      };

      await setDoc(doc(db, "booths", sellerId), boothData);
      console.log("Booth creado con ID (mismo que el sellerId): ", sellerId);
    }
    console.log("Todos los booths de prueba han sido creados exitosamente.");
  } catch (error) {
    console.error("Error al crear los booths de prueba: ", error);
  }
}

createTestBooths();
