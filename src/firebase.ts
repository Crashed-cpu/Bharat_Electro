// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMD6dbziqKIrwszA1WCvohcngIM_4JRQg",
  authDomain: "electro-91cbb.firebaseapp.com",
  projectId: "electro-91cbb",
  storageBucket: "electro-91cbb.firebasestorage.app",
  messagingSenderId: "431596462807",
  appId: "1:431596462807:web:6e81f89d6d5011a2890692",
  measurementId: "G-7617993FGZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
