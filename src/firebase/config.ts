import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyBLc_2YBWWUufNU6KwgD_QwFJ2513YJzd8",
  authDomain: "inventario-ziba424.firebaseapp.com",
  projectId: "inventario-ziba424",
  storageBucket: "inventario-ziba424.appspot.com",
  messagingSenderId: "46736147513",
  appId: "1:46736147513:web:cddaa283b6faab310bf9e8",
  measurementId: "G-BR2DHNVP9G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
