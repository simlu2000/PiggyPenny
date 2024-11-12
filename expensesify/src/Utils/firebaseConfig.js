// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { signOut as firebaseSignOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpcSg4fhlYz78TDw_MfnMbRoeoc8s8msU",
  authDomain: "expensisifyapp.firebaseapp.com",
  projectId: "expensisifyapp",
  storageBucket: "expensisifyapp.firebasestorage.app",
  messagingSenderId: "903742061472",
  appId: "1:903742061472:web:f7daf5f62ca0e0c4d8c2c5",
  measurementId: "G-K5C18Z80H6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


export const signOut = firebaseSignOut;
export { auth, googleProvider };