///

// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKvFQLvzd7OYpYeVy1JMIjm-WxOcJD7Yc",
  authDomain: "popuristore-a50ca.firebaseapp.com",
  projectId: "popuristore-a50ca",
  storageBucket: "popuristore-a50ca.firebasestorage.app",
  messagingSenderId: "155909070838",
  appId: "1:155909070838:web:d130b93fd8b9d5a152b1d7",
  measurementId: "G-Q0CR8WMTN8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
