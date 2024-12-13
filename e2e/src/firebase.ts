import admin from "firebase-admin";
import path from "path";

const serviceAccountPath = path.resolve(__dirname, "config/service-account-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: "sponsorcircle-3f648",
  });
}

export const firestore = admin.firestore();
