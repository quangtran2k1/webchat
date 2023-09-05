// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectAuthEmulator, FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyC-dFYp6fEwnxx44RBgITxhVgV3EUPvmoo',
    authDomain: 'webchat-531a1.firebaseapp.com',
    projectId: 'webchat-531a1',
    storageBucket: 'webchat-531a1.appspot.com',
    messagingSenderId: '989135310909',
    appId: '1:989135310909:web:b96f5d90eaed0ee1bdda54',
    measurementId: 'G-TB5YDZ84HN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const providerGg = new GoogleAuthProvider();
const providerFb = new FacebookAuthProvider();
const db = getFirestore(app);

if (window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
    connectFirestoreEmulator(db, '127.0.0.1', '8080');
}

export { auth, providerGg, providerFb, db };
