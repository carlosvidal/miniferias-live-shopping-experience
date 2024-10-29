// src/stores/auth.js
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { auth, db } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: useLocalStorage("auth_user", null),
    userRole: useLocalStorage("auth_user_role", null),
    loading: useLocalStorage("auth_loading", false),
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isSeller: (state) =>
      state.userRole === "seller" || state.userRole === "admin",
    isAdmin: (state) => state.userRole === "admin",
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
        await this.fetchUserRole();
      } finally {
        this.loading = false;
      }
    },

    async register(email, password, role, name, phoneNumber) {
      this.loading = true;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;

        // Crear documento de usuario
        await setDoc(doc(db, "users", this.user.uid), {
          email: this.user.email,
          name,
          phoneNumber,
          role,
        });

        this.userRole = role;

        // Si el usuario es un vendedor, crear un booth
        if (role === "seller") {
          await this.createBooth(this.user.uid, name);
        }
      } finally {
        this.loading = false;
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
      }
    },

    async logout() {
      this.loading = true;
      try {
        await signOut(auth);
        this.user = null;
        this.userRole = null;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserData(uid) {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.user = { ...this.user, ...userData };
          // Asegurarse de que el rol de administrador también tenga acceso de vendedor
          if (userData.role === "admin") {
            this.user.role = ["admin", "seller"];
          }
        } else {
          console.log("No se encontró el documento del usuario");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        this.error = error.message;
      }
    },

    async fetchUserRole() {
      if (this.user) {
        const userDoc = await getDoc(doc(db, "users", this.user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role;
        }
      }
    },

    async fetchUser() {
      return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            this.loading = true;
            if (user) {
              this.user = user;
              await this.fetchUserRole();
            } else {
              this.user = null;
              this.userRole = null;
            }
            this.loading = false;
            resolve(user);
          },
          (error) => {
            console.error(error);
            this.loading = false;
            reject(error);
          }
        );
        // Asegúrate de desuscribirte cuando el componente se desmonte
        if (import.meta.env.SSR === false) {
          import.meta.hot?.dispose(unsubscribe);
        }
      });
    },
  },
});
