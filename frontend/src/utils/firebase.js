import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBBu09sNsMOpBAjacrbyTjZsMbgpC8pcZI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "growth-gear-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "growth-gear-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "growth-gear-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "573630602489",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:573630602489:web:d16dba7fb35c21a5139628",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-85PGW0NHT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider options (optional, but good practice)
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signOut };
