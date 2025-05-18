import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB_Aw0rsb1pOxnbY5VELM4_oaaDMP-HDpY",
    authDomain: "skibidi-toilet1.firebaseapp.com",
    projectId: "skibidi-toilet1",
    messagingSenderId: "455017309902",
    appId: "1:455017309902:web:154998f311e0a26fe6d29f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);