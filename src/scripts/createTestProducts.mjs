// src/scripts/createTestProducts.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../services/firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const categories = {
  Electrónica: [
    "Smartphone",
    "Laptop",
    "Auriculares",
    "Smartwatch",
    "Cámara",
    "Drone",
    "Altavoz",
    "Tableta",
  ],
  Moda: [
    "Vestido",
    "Jeans",
    "Zapatillas",
    "Bolso",
    "Chaqueta",
    "Gafas de Sol",
    "Bufanda",
    "Reloj",
  ],
  Alimentación: [
    "Aceite de Oliva",
    "Quesos",
    "Vino",
    "Chocolate",
    "Café",
    "Mermelada",
    "Trufas",
    "Especias",
  ],
  Artesanía: [
    "Jarrón",
    "Tapiz",
    "Joyero",
    "Cuadro",
    "Escultura",
    "Máscara",
    "Velas",
    "Manta",
  ],
  "Deportes y Fitness": [
    "Bicicleta",
    "Pesas",
    "Esterilla de Yoga",
    "Reloj GPS",
    "Raqueta",
    "Balón",
    "Mochila",
    "Banda Elástica",
  ],
  "Hogar y Jardín": [
    "Lámpara",
    "Maceta",
    "Cojín",
    "Manta",
    "Set de Cocina",
    "Organizador",
    "Cuadro",
    "Planta",
  ],
  "Belleza y Cuidado Personal": [
    "Perfume",
    "Crema",
    "Maquillaje",
    "Cepillo",
    "Secador",
    "Afeitadora",
    "Esmalte",
    "Mascarilla",
  ],
  "Juguetes y Juegos": [
    "Muñeca",
    "Coche RC",
    "Puzzle",
    "Juego de Mesa",
    "Peluche",
    "Lego",
    "Consola",
    "Dron de Juguete",
  ],
  "Libros y Papelería": [
    "Novela",
    "Agenda",
    "Bolígrafos",
    "Cuaderno",
    "Marcadores",
    "Libro de Colorear",
    "Portafolio",
    "Calculadora",
  ],
  Mascotas: [
    "Cama para Mascota",
    "Juguete",
    "Comedero",
    "Collar",
    "Transportín",
    "Cepillo",
    "Rascador",
    "Snacks",
  ],
};

const generateProductsForBooth = (boothId, boothCategory) => {
  const categoryProducts =
    categories[boothCategory] || categories["Electrónica"];
  const numProducts = randomInt(5, 10);

  return Array(numProducts)
    .fill()
    .map(() => {
      const productName =
        categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
      return {
        boothId,
        name: productName,
        description: `Descripción de ${productName}`,
        price: randomInt(1000, 100000) / 100,
        imageUrl: `https://picsum.photos/400/400/?random=${randomInt(1, 1000)}`,
        stock: randomInt(10, 100),
      };
    });
};

async function createTestProducts() {
  try {
    const boothsSnapshot = await getDocs(collection(db, "booths"));

    for (const boothDoc of boothsSnapshot.docs) {
      const boothId = boothDoc.id;
      const boothData = boothDoc.data();
      console.log(
        `Procesando booth: ${boothData.name}, ID: ${boothId}, Categoría: ${boothData.category}`
      );

      const products = generateProductsForBooth(boothId, boothData.category);

      for (const product of products) {
        const docRef = await addDoc(collection(db, "products"), product);
        console.log("Producto creado con ID: ", docRef.id);
      }

      console.log(
        `Productos creados para el booth ${boothData.name} (ID: ${boothId})`
      );
    }

    console.log("Todos los productos de prueba han sido creados exitosamente.");
  } catch (error) {
    console.error("Error al crear los productos de prueba: ", error);
  }
}

createTestProducts();
