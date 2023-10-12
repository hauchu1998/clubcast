import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "clubcast-alpha.firebaseapp.com",
  projectId: "clubcast-alpha",
  storageBucket: "clubcast-alpha.appspot.com",
  messagingSenderId: "779438059956",
  appId: "1:779438059956:web:759a738e9b20fca07942e1",
  measurementId: "G-RQY63TK8QB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
