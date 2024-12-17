// Import Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDOyTEH6KQLjI7bvME5PC1c82qvgt4L67s",
    authDomain: "genz-fashion-9254f.firebaseapp.com",
    databaseURL: "https://genz-fashion-9254f-default-rtdb.firebaseio.com",
    projectId: "genz-fashion-9254f",
    storageBucket: "genz-fashion-9254f.appspot.com",
    messagingSenderId: "118664227099",
    appId: "1:118664227099:web:c311900ae7e8bcc6c30bbe",
    measurementId: "G-VB23HKY3CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);