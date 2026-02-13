import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy }
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3UIqSEwwVdS46lEHvGdzEe-FcBk1IWEY",
  authDomain: "bodegapp-e724b.firebaseapp.com",
  projectId: "bodegapp-e724b",
  storageBucket: "bodegapp-e724b.firebasestorage.app",
  messagingSenderId: "931478626307",
  appId: "1:931478626307:web:8562a728f1d6dc9311ee36",
  measurementId: "G-FV086B554R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const productosRef = collection(db, "productos");





