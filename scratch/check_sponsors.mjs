import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Read .env from Vite project directory
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

try {
  console.log("Fetching sponsors from Firestore...");
  const snap = await getDocs(collection(db, 'sponsors'));
  console.log(`Found ${snap.size} sponsors.`);
  
  snap.forEach(doc => {
    const data = doc.data();
    console.log("-----------------------------------------");
    console.log(`ID: ${doc.id}`);
    console.log(`Name: ${data.name}`);
    console.log(`Tier: ${data.tier}`);
    console.log(`URL: ${data.url}`);
    if (data.image) {
      console.log(`Image (length: ${data.image.length}): ${data.image.substring(0, 100)}...`);
    } else {
      console.log("Image: EMPTY");
    }
  });
  
  process.exit(0);
} catch (error) {
  console.error("Error querying sponsors:", error);
  process.exit(1);
}
