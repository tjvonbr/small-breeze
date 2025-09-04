import { initializeApp } from "firebase/app";

// const config = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// }

const config = {
  apiKey: "AIzaSyDr1-KopejsDr-AvUKfp4gq0rpfbhDDVxE",
  authDomain: "smallbreaze.firebaseapp.com",
  projectId: "smallbreaze",
  storageBucket: "smallbreaze.firebasestorage.app",
  messagingSenderId: "1096248031388",
  appId: "1:1096248031388:web:3bbedf08e98ac2f930d559",
  measurementId: "G-6KEZM6R8QY"
};

const firebase = initializeApp(config);

 export default firebase;
