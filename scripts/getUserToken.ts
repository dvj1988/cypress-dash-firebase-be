// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTbSRTRfR5RtMOxZbczkc_Ly6ri8kLon4",
  authDomain: "cypress-dashboard-c11c7.firebaseapp.com",
  projectId: "cypress-dashboard-c11c7",
  storageBucket: "cypress-dashboard-c11c7.appspot.com",
  messagingSenderId: "542871787691",
  appId: "1:542871787691:web:0aba70e352b132ec0b7fee",
};

// Initialize Firebase
initializeApp(firebaseConfig);
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, "diljitvj@gmail.com", "***")
  .then(async (userCredential) => {
    // Signed in
    const token = await userCredential.user.getIdToken();
    // ...

    console.log(token);
  })
  .catch((error) => {
    console.log(error);
  });
