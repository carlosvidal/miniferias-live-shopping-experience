// src/scripts/createTestSellers.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../services/firebase.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const generateTestSellers = (count) => {
  const sellers = [];
  for (let i = 1; i <= count; i++) {
    sellers.push({
      name: `Seller ${i}`,
      email: `seller${i}@example.com`,
      password: 'password123',
      phoneNumber: `+52 ${Math.floor(1000000000 + Math.random() * 9000000000)}`
    });
  }
  return sellers;
};

const testSellers = generateTestSellers(50);

async function createTestSellers() {
  try {
    for (const seller of testSellers) {
      const userCredential = await createUserWithEmailAndPassword(auth, seller.email, seller.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        name: seller.name,
        email: seller.email,
        role: 'seller',
        phoneNumber: seller.phoneNumber
      });

      console.log('Seller creado con ID: ', uid);
    }
    console.log('Todos los sellers de prueba han sido creados exitosamente.');
  } catch (error) {
    console.error('Error al crear los sellers de prueba: ', error);
  }
}

createTestSellers();