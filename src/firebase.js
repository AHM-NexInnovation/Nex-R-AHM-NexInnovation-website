// src/firebase.js
import {
    initializeApp
} from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import {
    getDatabase,
    ref,
    set,
    get,
    onValue
} from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAUhWwjiwlQdAcr44tf1S9qXoGRrFpyuvc",
    authDomain: "ahm-nexinnovation.firebaseapp.com",
    projectId: "ahm-nexinnovation",
    storageBucket: "ahm-nexinnovation.firebasestorage.app",
    messagingSenderId: "8860224178",
    appId: "1:8860224178:web:67ec4db75da067565157ab",
    databaseURL: "https://ahm-nexinnovation-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

export {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    ref,
    set,
    get,
    onValue
};