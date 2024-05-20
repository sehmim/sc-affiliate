// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWXupvRZY6tt6N0iyEG75R3p1bWQrzE3w",
  authDomain: "sponsorcircle-3f648.firebaseapp.com",
  databaseURL: "https://sponsorcircle-3f648-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sponsorcircle-3f648",
  storageBucket: "sponsorcircle-3f648.appspot.com",
  messagingSenderId: "547055390800",
  appId: "1:547055390800:web:f57eb71ef4b9a9bf6b8155",
  measurementId: "G-TSRLZ84JLY"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase);

export default firebase; 