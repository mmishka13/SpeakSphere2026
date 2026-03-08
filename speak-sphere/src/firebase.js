// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSVyTccTuNEWff-bD3Df3EMi4uXxwpY1E",
  authDomain: "speaksphere-1275e.firebaseapp.com",
  projectId: "speaksphere-1275e",
  storageBucket: "speaksphere-1275e.firebasestorage.app",
  messagingSenderId: "507477435145",
  appId: "1:507477435145:web:1015ad235af33a3e0ee9d8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);