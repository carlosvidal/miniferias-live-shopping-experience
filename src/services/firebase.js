import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBX0N9mZnpi6WZEQp9Yd18bM8vO50_sfHM",
  authDomain: "feriaviva-82f6e.firebaseapp.com",
  projectId: "feriaviva-82f6e",
  storageBucket: "feriaviva-82f6e.appspot.com",
  messagingSenderId: "239487798765",
  appId: "1:239487798765:web:4a1be1874f63989171abe4",
  measurementId: "G-3X840YWV10",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("Firebase initialized:", app.name);
console.log("Firestore instance:", db);

export { auth, db, firebaseConfig };
