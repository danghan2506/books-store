import {initializeApp} from "firebase/app"
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBeW5N_dsGy8LRIzXE3zkuiWzjUFI5tYpI",
  authDomain: "book-hub-4b85a.firebaseapp.com",
  projectId: "book-hub-4b85a",
  storageBucket: "book-hub-4b85a.firebasestorage.app",
  messagingSenderId: "734745296797",
  appId: "1:734745296797:web:ba3e1c69261869cc953974",
  measurementId: "G-V95W8MKD5V"
};
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()