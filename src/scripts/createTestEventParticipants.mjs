// src/scripts/createTestEventParticipants.mjs
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { firebaseConfig } from "../services/firebase.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getBooths() {
  const boothsSnapshot = await getDocs(collection(db, "booths"));
  return boothsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getEvents() {
  const eventsSnapshot = await getDocs(collection(db, "events"));
  return eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function createTestEventParticipants() {
  try {
    const booths = await getBooths();
    const events = await getEvents();

    for (const event of events) {
      const participantCount = Math.floor(Math.random() * 10) + 5; // 5 to 14 participants per event
      const shuffledBooths = booths.sort(() => 0.5 - Math.random());
      const selectedBooths = shuffledBooths.slice(0, participantCount);

      for (const booth of selectedBooths) {
        // Add event participant
        await addDoc(collection(db, "eventParticipants"), {
          eventId: event.id,
          boothId: booth.id,
          createdAt: new Date(),
        });

        // Update booth's eventIds
        await updateDoc(doc(db, "booths", booth.id), {
          eventIds: arrayUnion(event.id),
        });

        console.log(`Added booth ${booth.id} to event ${event.id}`);
      }

      console.log(
        `Added ${participantCount} participants to event ${event.id}`
      );
    }

    console.log(
      "Todos los eventParticipants de prueba han sido creados exitosamente."
    );
  } catch (error) {
    console.error("Error al crear los eventParticipants de prueba: ", error);
  }
}

createTestEventParticipants();
