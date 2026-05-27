import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
const auth = getAuth(app);
const db = getFirestore(app);

const rawPhone = '0966780188';
const password = 'Huy@10121996';
const email = `${rawPhone.replace(/[^0-9+]/g, '')}@vita-award.com`;

try {
  console.log(`Testing authentication for email: ${email}...`);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  console.log(`Success! Auth user UID: ${uid}`);

  console.log("Fetching profile from Firestore users collection...");
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    console.log("User document data:", userDoc.data());
  } else {
    console.log("WARNING: User document does not exist in Firestore!");
  }
  process.exit(0);
} catch (error) {
  console.error("Authentication failed:", error.message || error);
  process.exit(1);
}
