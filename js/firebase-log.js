import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiGsxjUc2Co2t4BUR96bWPGZWA28U-FvA",
  authDomain: "saem-security.firebaseapp.com",
  projectId: "saem-security",
  storageBucket: "saem-security.firebasestorage.app",
  messagingSenderId: "1030960413908",
  appId: "1:1030960413908:web:a63a5b6cd73752720bcf41"
};

(function logVisit() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    addDoc(collection(db, "visits"), {
      ts: serverTimestamp(),
      page: location.pathname,
      url: location.href,
      referrer: document.referrer || null,
      lang: document.documentElement.getAttribute("lang") || null,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
    }).catch(() => {});
  } catch (e) {}
})();