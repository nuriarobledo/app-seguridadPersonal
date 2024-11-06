import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyClWjj1XZ-cIeomvsv6NmabMd_RSKdyrNw",
  authDomain: "mialertaapp.firebaseapp.com",
  projectId: "mialertaapp",
  storageBucket: "mialertaapp.firebasestorage.app",
  messagingSenderId: "672204133746",
  appId: "1:672204133746:web:b326dfb4737b4b87c9f9eb"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia usando AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };