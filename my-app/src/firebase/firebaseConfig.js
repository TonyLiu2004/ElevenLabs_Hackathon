import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { auth, googleAuthProvider, analytics };
