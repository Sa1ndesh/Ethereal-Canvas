// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD117yLxim90JzPd3Nxoj90nsfY82lvbJU",
  authDomain: "canvus-f9ada.firebaseapp.com",
  projectId: "canvus-f9ada",
  storageBucket: "canvus-f9ada.firebasestorage.app",
  messagingSenderId: "395519302240",
  appId: "1:395519302240:web:b133c2607a910c819b4105",
  measurementId: "G-Z0ERZE6KL9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
