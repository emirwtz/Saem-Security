(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAgR0vPelPAfcXSkEHfT3bmypHpd8dLcKY",
    authDomain: "saem-security-5d2b5.firebaseapp.com",
    projectId: "saem-security-5d2b5",
    storageBucket: "saem-security-5d2b5.firebasestorage.app",
    messagingSenderId: "513970972570",
    appId: "1:513970972570:web:a1f400127b7e9318dc7c23"
  };

  if (!window.firebase) {
    console.warn("Firebase SDK is not loaded, firebase-log.js did not execute.");
    return;
  }

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  const SESSION_KEY = "saem_logged_this_session";

  function getGeoInfo() {
    return fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.success === false) return {};
        return {
          ip: data.ip || null,
          country: data.country || null,
          city: data.city || null,
          region: data.region || null,
        };
      })
      .catch(() => ({}));
  }

  function logVisit() {
    getGeoInfo().then((geo) => {
      db.collection("visits")
        .add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
          language: navigator.language,
          screen: window.screen.width + "x" + window.screen.height,
          ip: geo.ip || null,
          country: geo.country || null,
          city: geo.city || null,
          region: geo.region || null,
        })
        .then(() => {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch (e) {}
        })
        .catch((err) => console.error("Logging error:", err));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    logVisit();
  });
})();