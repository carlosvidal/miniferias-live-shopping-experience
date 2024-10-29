// src/stores/booth.js
import { defineStore } from "pinia";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export const useBoothStore = defineStore("booth", {
  state: () => ({
    currentBooth: null,
    eventBooths: [],
    allBooths: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAllBooths() {
      this.loading = true;
      this.error = null;
      try {
        const boothsQuery = query(collection(db, "booths"));
        const boothsSnap = await getDocs(boothsQuery);

        this.allBooths = boothsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched all booths:", this.allBooths);
      } catch (error) {
        console.error("Error fetching all booths:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchBoothDetails(boothId) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching booth details for ID:", boothId);
        const boothRef = doc(db, "booths", boothId);
        const boothSnap = await getDoc(boothRef);

        if (boothSnap.exists()) {
          this.currentBooth = { id: boothSnap.id, ...boothSnap.data() };
          console.log("Fetched booth details:", this.currentBooth);
        } else {
          throw new Error("No se encontró el stand");
        }
      } catch (error) {
        console.error("Error fetching booth details:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchBoothsByEventId(eventId) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching booths for event ID:", eventId);
        const boothsQuery = query(
          collection(db, "booths"),
          where("eventIds", "array-contains", eventId)
        );
        const boothsSnap = await getDocs(boothsQuery);

        this.eventBooths = boothsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched booths for event:", this.eventBooths);
      } catch (error) {
        console.error("Error fetching event booths:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async addBoothToEvent(sellerId, eventId) {
      try {
        // Primero, buscar el booth del vendedor
        const boothsQuery = query(
          collection(db, "booths"),
          where("sellerId", "==", sellerId)
        );
        const boothsSnap = await getDocs(boothsQuery);

        if (boothsSnap.empty) {
          throw new Error("No se encontró un booth para este vendedor");
        }

        const boothDoc = boothsSnap.docs[0];
        const boothRef = doc(db, "booths", boothDoc.id);
        const boothData = boothDoc.data();

        // Asegurarse de que eventIds es un array
        const currentEventIds = Array.isArray(boothData.eventIds)
          ? boothData.eventIds
          : [];

        // Añadir el eventId al array de eventIds del booth si no está ya presente
        if (!currentEventIds.includes(eventId)) {
          await updateDoc(boothRef, {
            eventIds: arrayUnion(eventId),
          });
        }

        // Actualizar el estado local
        const updatedEventIds = [...new Set([...currentEventIds, eventId])];
        const updatedBooth = {
          id: boothDoc.id,
          ...boothData,
          eventIds: updatedEventIds,
        };

        // Actualizar allBooths
        const index = this.allBooths.findIndex((b) => b.id === boothDoc.id);
        if (index !== -1) {
          this.allBooths[index] = updatedBooth;
        } else {
          this.allBooths.push(updatedBooth);
        }

        // Actualizar eventBooths
        const eventBoothIndex = this.eventBooths.findIndex(
          (b) => b.id === boothDoc.id
        );
        if (eventBoothIndex !== -1) {
          this.eventBooths[eventBoothIndex] = updatedBooth;
        } else {
          this.eventBooths.push(updatedBooth);
        }

        console.log(`Booth ${boothDoc.id} added to event ${eventId}`);
      } catch (error) {
        console.error("Error adding booth to event:", error);
        throw error;
      }
    },

    async removeBoothFromEvent(boothId, eventId) {
      try {
        const boothRef = doc(db, "booths", boothId);
        const boothSnap = await getDoc(boothRef);

        if (!boothSnap.exists()) {
          throw new Error("No se encontró el booth");
        }

        const boothData = boothSnap.data();
        const currentEventIds = Array.isArray(boothData.eventIds)
          ? boothData.eventIds
          : [];

        // Remover el eventId del array de eventIds del booth
        if (currentEventIds.includes(eventId)) {
          await updateDoc(boothRef, {
            eventIds: arrayRemove(eventId),
          });
        }

        // Actualizar el estado local
        const updatedEventIds = currentEventIds.filter((id) => id !== eventId);
        const updatedBooth = {
          id: boothId,
          ...boothData,
          eventIds: updatedEventIds,
        };

        // Actualizar allBooths
        const index = this.allBooths.findIndex((b) => b.id === boothId);
        if (index !== -1) {
          this.allBooths[index] = updatedBooth;
        }

        // Actualizar eventBooths
        this.eventBooths = this.eventBooths.filter(
          (booth) => booth.id !== boothId
        );

        console.log(`Booth ${boothId} removed from event ${eventId}`);
      } catch (error) {
        console.error("Error removing booth from event:", error);
        throw error;
      }
    },
  },
});
