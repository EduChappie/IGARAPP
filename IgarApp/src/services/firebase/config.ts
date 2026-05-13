import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp, FieldValue } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDsyUw3bsNl9VeG87QThE48sbrA3I5fTCg",
  authDomain: "appambiental-d62ca.firebaseapp.com",
  projectId: "appambiental-d62ca",
  storageBucket: "appambiental-d62ca.firebasestorage.app",
  messagingSenderId: "740128796600",
  appId: "1:740128796600:web:8a02e89de46b1910f8694d"
};

const app = initializeApp(firebaseConfig);


console.log('Firebase inicializado com sucesso');

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = getFirestore(app)
export { FieldValue, serverTimestamp };

export const configureFirestore = () => {
  console.log('Configurações do Firestore inicializadas');
};

configureFirestore();

export default app;