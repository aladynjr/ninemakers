// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN95uw1BjCsEzD5p8ByH1DNQ_X2IKU3Wg",
  authDomain: "makers-8b71a.firebaseapp.com",
  projectId: "makers-8b71a",
  storageBucket: "makers-8b71a.appspot.com",
  messagingSenderId: "368263608247",
  appId: "1:368263608247:web:65edfa3348d2c30c3b1a32",
  measurementId: "G-ZMJRWV164B"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

const analytics = getAnalytics(app);