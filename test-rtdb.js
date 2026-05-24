import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set } from "firebase/database";

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
const rtdb = getDatabase(app);

async function testWrite() {
  try {
    console.log("Testing write to RTDB...");
    const inquiriesRef = ref(rtdb, 'inquiries');
    const newInquiryRef = push(inquiriesRef);
    await set(newInquiryRef, { test: "data" });
    console.log("Success writing to RTDB!");
  } catch (err) {
    console.error("Error writing to RTDB:", err.message);
  }
  process.exit(0);
}

testWrite();
