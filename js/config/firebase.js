import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDU3dOgxnBULoHTnEqJ9Fha1RfhFatJvKg",
  authDomain: "anas-todo.firebaseapp.com",
  projectId: "anas-todo",
  storageBucket: "anas-todo.appspot.com",
  messagingSenderId: "47235008013",
  appId: "1:47235008013:web:0feda64bfc413485c17744",
  measurementId: "G-WP3PQ261QR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  setDoc,
  db,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  updateDoc,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
};
