// src/stores/events.js
import { defineStore } from "pinia";
import {
  collection,
  query,
  where,
  orderBy,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/services/firebase";

export const useEventsStore = defineStore("events", {
  state: () => ({
    events: [],
    currentEvent: null,
    eventParticipants: {},
    loading: false,
    error: null,
  }),

  getters: {
    upcomingAndOngoingEvents: (state) => {
      const now = new Date();
      return state.events
        .filter((event) => new Date(event.endDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    },
    getEventParticipants: (state) => (eventId) => {
      return state.eventParticipants[eventId] || [];
    },
  },
  actions: {
    async fetchAllEvents() {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching all events");
        const now = Timestamp.now();
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          where("endDate", ">=", now),
          orderBy("endDate", "asc"),
          orderBy("startDate", "asc")
        );
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);
        this.events = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
            sellers: data.sellers || [],
          };
        });
        console.log("Fetched events:", this.events);
      } catch (error) {
        this.error = `Error fetching events: ${error.message}`;
        console.error("Error fetching events:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchActiveEvents() {
      this.loading = true;
      this.error = null;
      try {
        const now = Timestamp.now();
        const q = query(
          collection(db, "events"),
          where("startDate", "<=", now),
          where("endDate", ">=", now)
        );
        const querySnapshot = await getDocs(q);
        this.activeEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
        }));
      } catch (error) {
        this.error = `Error fetching active events: ${error.message}`;
        console.error("Error fetching active events:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchSellerEvents(sellerId) {
      this.loading = true;
      try {
        const q = query(
          collection(db, "events"),
          where("sellerId", "==", sellerId)
        );
        const querySnapshot = await getDocs(q);
        this.sellerEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          startDate: doc.data().startDate.toDate(),
          endDate: doc.data().endDate.toDate(),
        }));
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching seller events:", error);
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventData) {
      this.loading = true;
      try {
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          startDate: Timestamp.fromDate(new Date(eventData.startDate)),
          endDate: Timestamp.fromDate(new Date(eventData.endDate)),
          createdAt: Timestamp.now(),
        });
        const newEvent = {
          id: docRef.id,
          ...eventData,
        };
        this.events.push(newEvent);
        this.sellerEvents.push(newEvent);
      } catch (error) {
        this.error = error.message;
        console.error("Error creating event:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(eventId, eventData) {
      this.loading = true;
      try {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
          ...eventData,
          startDate: Timestamp.fromDate(new Date(eventData.startDate)),
          endDate: Timestamp.fromDate(new Date(eventData.endDate)),
          updatedAt: Timestamp.now(),
        });
        const index = this.events.findIndex((event) => event.id === eventId);
        if (index !== -1) {
          this.events[index] = { ...this.events[index], ...eventData };
        }
        const sellerIndex = this.sellerEvents.findIndex(
          (event) => event.id === eventId
        );
        if (sellerIndex !== -1) {
          this.sellerEvents[sellerIndex] = {
            ...this.sellerEvents[sellerIndex],
            ...eventData,
          };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error updating event:", error);
      } finally {
        this.loading = false;
      }
    },

    async deleteEvent(eventId) {
      this.loading = true;
      try {
        await deleteDoc(doc(db, "events", eventId));
        this.events = this.events.filter((event) => event.id !== eventId);
        this.sellerEvents = this.sellerEvents.filter(
          (event) => event.id !== eventId
        );
      } catch (error) {
        this.error = error.message;
        console.error("Error deleting event:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchEventById(eventId) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching event with ID:", eventId);
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);

        if (eventSnap.exists()) {
          const data = eventSnap.data();
          this.currentEvent = {
            id: eventSnap.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
          };
          console.log("Fetched event:", this.currentEvent);
        } else {
          console.log("Event not found");
          this.currentEvent = null;
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateEventSellers(eventId, sellerIds) {
      try {
        const eventRef = doc(db, "events", eventId);
        const event = this.events.find((e) => e.id === eventId);

        // Eliminar vendedores que ya no están seleccionados
        const sellersToRemove = (event.sellers || []).filter(
          (id) => !sellerIds.includes(id)
        );
        if (sellersToRemove.length > 0) {
          await updateDoc(eventRef, {
            sellers: arrayRemove(...sellersToRemove),
          });
        }

        // Añadir nuevos vendedores seleccionados
        const sellersToAdd = sellerIds.filter(
          (id) => !(event.sellers || []).includes(id)
        );
        if (sellersToAdd.length > 0) {
          await updateDoc(eventRef, {
            sellers: arrayUnion(...sellersToAdd),
          });
        }

        // Actualizar el estado local
        const index = this.events.findIndex((e) => e.id === eventId);
        if (index !== -1) {
          this.events[index] = { ...this.events[index], sellers: sellerIds };
        }
      } catch (error) {
        console.error("Error updating event sellers:", error);
        throw error;
      }
    },

    async fetchEventParticipants(eventId) {
      try {
        const q = query(
          collection(db, "eventParticipants"),
          where("eventId", "==", eventId)
        );
        const querySnapshot = await getDocs(q);
        this.eventParticipants[eventId] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(
          `Fetched participants for event ${eventId}:`,
          this.eventParticipants[eventId]
        );
      } catch (error) {
        console.error("Error fetching event participants:", error);
        this.error = error.message;
      }
    },

    async addEventParticipant(eventId, sellerId) {
      try {
        const docRef = await addDoc(collection(db, "eventParticipants"), {
          eventId,
          sellerId,
          createdAt: Timestamp.now(),
        });
        if (!this.eventParticipants[eventId]) {
          this.eventParticipants[eventId] = [];
        }
        this.eventParticipants[eventId].push({
          id: docRef.id,
          eventId,
          sellerId,
        });
        console.log(`Added participant to event ${eventId}:`, {
          id: docRef.id,
          eventId,
          sellerId,
        });
      } catch (error) {
        console.error("Error adding event participant:", error);
        throw error;
      }
    },

    async removeEventParticipant(eventId, participantId) {
      try {
        await deleteDoc(doc(db, "eventParticipants", participantId));
        this.eventParticipants[eventId] = this.eventParticipants[
          eventId
        ].filter((p) => p.id !== participantId);
        console.log(
          `Removed participant ${participantId} from event ${eventId}`
        );
      } catch (error) {
        console.error("Error removing event participant:", error);
        throw error;
      }
    },

    async fetchEventByIdentifier(identifier) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Fetching event with identifier:", identifier);
        let eventDoc;

        // Primero, intentar buscar por slug
        const q = query(
          collection(db, "events"),
          where("slug", "==", identifier)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          eventDoc = querySnapshot.docs[0];
        } else {
          // Si no se encuentra por slug, intentar buscar por id
          const docRef = doc(db, "events", identifier);
          eventDoc = await getDoc(docRef);
        }

        if (eventDoc.exists()) {
          const data = eventDoc.data();
          this.currentEvent = {
            id: eventDoc.id,
            ...data,
            startDate: data.startDate?.toDate(),
            endDate: data.endDate?.toDate(),
          };
          console.log("Fetched event:", this.currentEvent);
        } else {
          console.log("Event not found");
          this.currentEvent = null;
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createEvent(eventData) {
      this.loading = true;
      try {
        if (!eventData.slug) {
          eventData.slug = this.generateSlug(eventData.name);
        }
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          startDate: Timestamp.fromDate(new Date(eventData.startDate)),
          endDate: Timestamp.fromDate(new Date(eventData.endDate)),
          createdAt: Timestamp.now(),
        });
        const newEvent = {
          id: docRef.id,
          ...eventData,
        };
        this.events.push(newEvent);
      } catch (error) {
        this.error = error.message;
        console.error("Error creating event:", error);
      } finally {
        this.loading = false;
      }
    },

    async updateEvent(eventId, eventData) {
      this.loading = true;
      try {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, {
          ...eventData,
          startDate: Timestamp.fromDate(new Date(eventData.startDate)),
          endDate: Timestamp.fromDate(new Date(eventData.endDate)),
          updatedAt: Timestamp.now(),
        });
        const index = this.events.findIndex((event) => event.id === eventId);
        if (index !== -1) {
          this.events[index] = { ...this.events[index], ...eventData };
        }
        if (this.currentEvent && this.currentEvent.id === eventId) {
          this.currentEvent = { ...this.currentEvent, ...eventData };
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error updating event:", error);
      } finally {
        this.loading = false;
      }
    },

    generateSlug(name) {
      return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
    },
  },
});
