import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjjSjuVqKY5R3-dMbUyaVsv0q9F-4_d2c",
  authDomain: "lakshmipuram-ganesh-2026.firebaseapp.com",
  projectId: "lakshmipuram-ganesh-2026",
  storageBucket: "lakshmipuram-ganesh-2026.firebasestorage.app",
  messagingSenderId: "47966741403",
  appId: "1:47966741403:web:c63f585cafd6883269f73e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);