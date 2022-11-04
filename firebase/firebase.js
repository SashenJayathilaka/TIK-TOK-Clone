import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBtSO1ooUrDPYlZp2B_KZxi5E9Sy8cLKA",
  authDomain: "tiktok-clone-be0aa.firebaseapp.com",
  projectId: "tiktok-clone-be0aa",
  storageBucket: "tiktok-clone-be0aa.appspot.com",
  messagingSenderId: "668135954772",
  appId: "1:668135954772:web:b442fc20cbefc5aa0450c1"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// export
export { app, auth, firestore, storage };