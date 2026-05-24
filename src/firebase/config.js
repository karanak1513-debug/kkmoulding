import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUyw6bOWQ4FVprcGV8hlORNSWAznXt9vk",
  authDomain: "k-k-moulding.firebaseapp.com",
  databaseURL: "https://k-k-moulding-default-rtdb.firebaseio.com",
  projectId: "k-k-moulding",
  storageBucket: "k-k-moulding.firebasestorage.app",
  messagingSenderId: "222781054274",
  appId: "1:222781054274:web:a340677a9c8d26d4277cdb",
  measurementId: "G-YMXPH75FQV"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
