// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoOcs9w0Q5PeWvTM9NMWMa0phKKCCBvFs",
  authDomain: "genealogy-app-47e4e.firebaseapp.com",
  projectId: "genealogy-app-47e4e",
  storageBucket: "genealogy-app-47e4e.appspot.com",
  messagingSenderId: "693502123667",
  appId: "1:693502123667:web:d7014da39c612060fff766",
  measurementId: "G-9L5YV4VQPP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db };
