import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// -----------------------------------------------------------------------------
// FORCE_MOCK_MODE: Set to true to run the app entirely offline with mock data.
// Use this for client design reviews or hosting static demos on GitHub Pages
// without exposing or connecting to the real Firebase backend.
// Set to false when you are ready to connect to your live Firebase database!
// -----------------------------------------------------------------------------
const FORCE_MOCK_MODE = true; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isConfigured = !FORCE_MOCK_MODE && firebaseConfig.apiKey && firebaseConfig.apiKey !== 'mock-api-key';

let app, auth, db, storage;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.warn("Firebase is running in MOCK mode because config keys are missing or set to placeholder values. Copy .env.example to .env and configure Firebase keys.");
}

export { auth, db, storage, isConfigured };
