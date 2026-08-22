// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sakshamai-341bd.firebaseapp.com",
  projectId: "sakshamai-341bd",
  storageBucket: "sakshamai-341bd.firebasestorage.app",
  messagingSenderId: "605326022170",
  appId: "1:605326022170:web:8eb654598c43ef77f2a3a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };