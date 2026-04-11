const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyCZv-Yc1E3AuWOWDxM9RQvjyL9UYN7Vkmc",
  authDomain: "shinraigo-3d145.firebaseapp.com",
  projectId: "shinraigo-3d145",
  storageBucket: "shinraigo-3d145.firebasestorage.app",
  messagingSenderId: "896202634814",
  appId: "1:896202634814:web:6b2d52afd26b31d2b9c36f",
  measurementId: "G-ED97Y7FZFT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "nexus3340@gmail.com", "Nexus334023K")
  .then((userCredential) => {
    console.log("Logged in:", userCredential.user.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error signing in:", error.code, error.message);
    process.exit(1);
  });
