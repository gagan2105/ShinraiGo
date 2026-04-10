import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZv-Yc1E3AuWOWDxM9RQvjyL9UYN7Vkmc",
  authDomain: "shinraigo-3d145.firebaseapp.com",
  projectId: "shinraigo-3d145",
  storageBucket: "shinraigo-3d145.firebasestorage.app",
  messagingSenderId: "896202634814",
  appId: "1:896202634814:web:6b2d52afd26b31d2b9c36f",
  measurementId: "G-ED97Y7FZFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, analytics };
export default app;
