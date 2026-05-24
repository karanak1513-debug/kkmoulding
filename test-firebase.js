import { initializeApp } from "firebase/app";
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
const db = getFirestore(app);

async function testWrite() {
  try {
    console.log("Testing write to 'inquiries'...");
    await addDoc(collection(db, "inquiries"), { test: "data" });
    console.log("Success writing to inquiries!");
  } catch (err) {
    console.error("Error writing to inquiries:", err.message);
  }

  try {
    console.log("Testing write to 'contact_submissions'...");
    await addDoc(collection(db, "contact_submissions"), { test: "data" });
    console.log("Success writing to contact_submissions!");
  } catch (err) {
    console.error("Error writing to contact_submissions:", err.message);
  }
  
  process.exit(0);
}

testWrite();
