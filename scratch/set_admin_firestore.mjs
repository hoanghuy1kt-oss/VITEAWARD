import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

const email = 'admin@vita.vn';
const password = 'admin@123';

try {
  console.log(`Signing in as ${email}...`);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  console.log(`Signed in successfully. UID: ${uid}`);

  console.log(`Writing admin doc to users collection...`);
  await setDoc(doc(db, 'users', uid), {
    uid: uid,
    name: 'Admin Hoang Huy',
    email: email,
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  console.log(`SUCCESS: Firestore admin document created/updated successfully!`);
  process.exit(0);
} catch (error) {
  console.error("FAILED:", error.message || error);
  process.exit(1);
}
