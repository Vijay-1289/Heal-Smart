import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao",
  authDomain: "heal-smart-1289.firebaseapp.com",
  projectId: "heal-smart-1289",
  storageBucket: "heal-smart-1289.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 