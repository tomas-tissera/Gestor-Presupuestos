// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Importar Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzig142rd6t6oao5ltZULzM841j0-OPMc",
  authDomain: "presupuesto-generador.firebaseapp.com",
  projectId: "presupuesto-generador",
  storageBucket: "presupuesto-generador.appspot.com",
  messagingSenderId: "1077341630373",
  appId: "1:1077341630373:web:1981014ffc233b1946824c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Inicializar Firestore

// Export the auth and db instances
export { auth, db };
