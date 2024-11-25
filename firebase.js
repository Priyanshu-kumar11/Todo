// Import the necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAiH4ypmhTozkZvzV7p_MtNjRM45RCh22A",
  authDomain: "todo-e3add.firebaseapp.com",
  projectId: "todo-e3add",
  storageBucket: "todo-e3add.firebasestorage.app",
  messagingSenderId: "275151984500",
  appId: "1:275151984500:web:8047acbfe0c1be01b47e21"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
