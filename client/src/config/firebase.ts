import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAnWMDudQ594CSE1yH7o1P4NZ7k9DOKNUU',
    authDomain: 'emcommer-a9153.firebaseapp.com',
    projectId: 'emcommer-a9153',
    storageBucket: 'emcommer-a9153.firebasestorage.app',
    messagingSenderId: '366632738360',
    appId: '1:366632738360:web:73ffc9721b8b1ac05b90cd',
    measurementId: 'G-QCXWK072PJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
