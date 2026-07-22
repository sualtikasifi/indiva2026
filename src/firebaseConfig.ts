import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Aynı Firebase projesi (indiva-expo) — panel ve İNDİVA mobil app ile paylaşılan
// public web config (Firestore güvenlik kurallarıyla korunur, gizli değildir).
const firebaseConfig = {
  apiKey: 'AIzaSyB4sjujBvM9WwvrsIllRAsP3EhPDkjmMCs',
  authDomain: 'indiva-expo.firebaseapp.com',
  projectId: 'indiva-expo',
  storageBucket: 'indiva-expo.firebasestorage.app',
  messagingSenderId: '905697488486',
  appId: '1:905697488486:web:befb0b4655584dc04b07a7',
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const db = getFirestore(app);
