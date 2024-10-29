// src/stores/users.js
import { defineStore } from "pinia";
import { db, auth } from "@/services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    sellers: [],
  }),

  actions: {
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    },

    async fetchSellers() {
      try {
        const q = query(collection(db, "users"), where("role", "==", "seller"));
        const querySnapshot = await getDocs(q);
        this.sellers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching sellers:", error);
        throw error;
      }
    },

    getUserById(userId) {
      return this.users.find((user) => user.id === userId);
    },

    async addUser(userData) {
      try {
        // Crear el usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password
        );
        const uid = userCredential.user.uid;

        // Añadir el usuario a Firestore
        await setDoc(doc(db, "users", uid), {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber || "",
        });

        // Si el usuario es un vendedor, crear un booth
        if (userData.role === "seller") {
          await this.createBooth(uid, userData.name);
        }

        // Actualizar el estado local
        this.users.push({ id: uid, ...userData });
      } catch (error) {
        console.error("Error adding user:", error);
        throw error;
      }
    },

    async updateUser(userData) {
      try {
        const userRef = doc(db, "users", userData.id);
        await updateDoc(userRef, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phoneNumber: userData.phoneNumber,
        });

        // Si el usuario se convierte en vendedor, crear un booth
        if (
          userData.role === "seller" &&
          !(await this.userHasBooth(userData.id))
        ) {
          await this.createBooth(userData.id, userData.name);
        }

        // Actualizar el estado local
        const index = this.users.findIndex((user) => user.id === userData.id);
        if (index !== -1) {
          this.users[index] = userData;
        }
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async deleteUser(userId) {
      try {
        await deleteDoc(doc(db, "users", userId));
        // Actualizar el estado local
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async createBooth(sellerId, sellerName) {
      try {
        const boothRef = await addDoc(collection(db, "booths"), {
          sellerId,
          name: `${sellerName}'s Booth`,
          description: "",
          category: "",
          eventIds: [],
        });
        console.log("Booth created with ID: ", boothRef.id);
      } catch (error) {
        console.error("Error creating booth: ", error);
        throw error;
      }
    },

    async userHasBooth(userId) {
      const querySnapshot = await getDocs(collection(db, "booths"));
      return querySnapshot.docs.some((doc) => doc.data().sellerId === userId);
    },
  },
});
