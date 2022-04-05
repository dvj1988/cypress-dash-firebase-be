import * as functions from "firebase-functions";
import projectsApp from "./apps/projects";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
const firebaseHttps = functions.region("asia-south1").https.onRequest;

// Functions
export const projects = firebaseHttps(projectsApp);
