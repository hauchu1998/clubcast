import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhiaOfMPml8kRExCAFXBkFxy6Y34wV7mY",
  authDomain: "clubcast-alpha.firebaseapp.com",
  projectId: "clubcast-alpha",
  storageBucket: "clubcast-alpha.appspot.com",
  messagingSenderId: "779438059956",
  appId: "1:779438059956:web:759a738e9b20fca07942e1",
  measurementId: "G-RQY63TK8QB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// const analytics = getAnalytics(app);
export default app;
