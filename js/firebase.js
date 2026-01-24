import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAZzUCyHF-P5T0fF5P2fbmWWfcTyWvpl-M",
  authDomain: "bodega-hogar.firebaseapp.com",
  projectId: "bodega-hogar",
  storageBucket: "bodega-hogar.firebasestorage.app",
  messagingSenderId: "916766238588",
  appId: "1:916766238588:web:82a46c12eb6b5c3d28e6f9",
  measurementId: "G-9Z04JEBWYW"
};

const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app);
export const productosRef = collection(db, "productos");





