import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCVU6-ULT6OHYSGBHmvM3ne3VNLdlQSesg",
  authDomain: "shinraigo-494f5.firebaseapp.com",
  projectId: "shinraigo-494f5",
  storageBucket: "shinraigo-494f5.firebasestorage.app",
  messagingSenderId: "823144710360",
  appId: "1:823144710360:web:0f5fa04ffaa64e2402d7ad",
  measurementId: "G-ZLB7EM2B9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

// Set browser persistence to LOCAL for a market-ready experience
setPersistence(auth, browserLocalPersistence)
  .catch((error) => console.error("Firebase Persistence Error:", error));

export { auth, db, analytics };
export default app;
