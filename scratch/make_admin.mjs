import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

const envPath = './.env';
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uid = 'KkYRSbmk6sOSO3T7daxFwnpX0Ji1'; // UID of Hoàng Huy (0966780188)

try {
  console.log(`Elevating user with UID: ${uid} to admin...`);
  await updateDoc(doc(db, 'users', uid), {
    role: 'admin'
  });
  console.log("Success! User has been elevated to admin role.");
  process.exit(0);
} catch (error) {
  console.error("Failed to update user role:", error.message || error);
  process.exit(1);
}
