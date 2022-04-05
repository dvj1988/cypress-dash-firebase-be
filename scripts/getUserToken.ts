// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import fs from "fs";
import path from "path";

const config = fs.readFileSync(
  path.resolve(__dirname, "./firebaseConfig.json"),
  { encoding: "utf8" }
);

// Initialize Firebase
initializeApp(JSON.parse(config));
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, "***@gmail.com", "***")
  .then(async (userCredential) => {
    // Signed in
    const token = await userCredential.user.getIdToken();
    // ...

    console.log(token);
  })
  .catch((error) => {
    console.log(error);
  });
