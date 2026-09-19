import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let db;
let auth;
let isInitialized = false;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      }),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
    });

    db = admin.firestore();
    auth = admin.auth();
    isInitialized = true;
    console.log('[Firebase] Connected successfully to live Firebase Firestore & Auth.');
  } else {
    console.log('[Firebase] Live credentials not provided in .env. Running with local development store.');
  }
} catch (error) {
  console.warn('[Firebase] Initialization warning:', error.message);
}

export { admin, db, auth, isInitialized };
