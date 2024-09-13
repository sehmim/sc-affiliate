// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBWXupvRZY6tt6N0iyEG75R3p1bWQrzE3w",
//   authDomain: "sponsorcircle-3f648.firebaseapp.com",
//   databaseURL: "https://sponsorcircle-3f648-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "sponsorcircle-3f648",
//   storageBucket: "sponsorcircle-3f648.appspot.com",
//   messagingSenderId: "547055390800",
//   appId: "1:547055390800:web:f57eb71ef4b9a9bf6b8155",
//   measurementId: "G-TSRLZ84JLY"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBWXupvRZY6tt6N0iyEG75R3p1bWQrzE3w",
  authDomain: "sponsorcircle-3f648.firebaseapp.com",
  projectId: "sponsorcircle-3f648",
  storageBucket: "sponsorcircle-3f648.appspot.com",
  messagingSenderId: "547055390800",
  appId: "1:547055390800:web:f57eb71ef4b9a9bf6b8155",
  measurementId: "G-TSRLZ84JLY"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export default app; 
const auth = getAuth(app);
export { auth };