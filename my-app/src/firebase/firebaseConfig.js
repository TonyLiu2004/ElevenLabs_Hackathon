import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH0LWUU0C17tZxdKZ1qFAuJefcl2WEeOI",
  authDomain: "elevenlabs-hackathon-b13ce.firebaseapp.com",
  projectId: "elevenlabs-hackathon-b13ce",
  storageBucket: "elevenlabs-hackathon-b13ce.appspot.com",
  messagingSenderId: "413740686446",
  appId: "1:413740686446:web:a2c6c15fb7246c64dd5a7f",
  measurementId: "G-DW80ZXNLM1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider, db, collection, addDoc, serverTimestamp };
