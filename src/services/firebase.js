// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBo651bFgjrLHkrd2M-Uhdhx-v4Zthh51Q",
  authDomain: "app-finanzas-e484f.firebaseapp.com",
  projectId: "app-finanzas-e484f",
  storageBucket: "app-finanzas-e484f.firebasestorage.app",
  messagingSenderId: "864188603793",
  appId: "1:864188603793:web:751824015a7e9776b68e30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)

export const googleProvider =
  new GoogleAuthProvider()