import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyDg4j_LJWbLnVzD9dHAbX37MOQGwaEJX-g",
  authDomain: "vtormetprom-react-native.firebaseapp.com",
  projectId: "vtormetprom-react-native",
  storageBucket: "vtormetprom-react-native.appspot.com",
  messagingSenderId: "711070583794",
  appId: "1:711070583794:web:203a0bb094f437825b796b"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

