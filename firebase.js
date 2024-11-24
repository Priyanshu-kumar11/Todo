// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAiH4ypmhTozkZvzV7p_MtNjRM45RCh22A",
  authDomain: "todo-e3add.firebaseapp.com",
  projectId: "todo-e3add",
  storageBucket: "todo-e3add.firebasestorage.app",
  messagingSenderId: "275151984500",
  appId: "1:275151984500:web:8047acbfe0c1be01b47e21"
};

// Initialize Firebase
const  app = initializeApp(firebaseConfig);
export const db = getFirestore(app)