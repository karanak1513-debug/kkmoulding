import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUyw6bOWQ4FVprcGV8hlORNSWAznXt9vk",
  authDomain: "k-k-moulding.firebaseapp.com",
  projectId: "k-k-moulding",
  storageBucket: "k-k-moulding.firebasestorage.app",
  messagingSenderId: "222781054274",
  appId: "1:222781054274:web:a340677a9c8d26d4277cdb",
  measurementId: "G-YMXPH75FQV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testWrite() {
  try {
    console.log("Signing in anonymously...");
    await signInAnonymously(auth);
    console.log("Success! User ID:", auth.currentUser.uid);
  } catch (err) {
    console.error("Anonymous auth failed:", err.message);
    process.exit(1);
  }

  try {
    console.log("Testing write to inquiries...");
    await addDoc(collection(db, "inquiries"), { test: "data" });
    console.log("Success writing to inquiries!");
  } catch (err) {
    console.error("Error writing to inquiries:", err.message);
  }
  process.exit(0);
}

testWrite();
