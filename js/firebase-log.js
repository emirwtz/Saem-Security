(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAgR0vPelPAfcXSkEHfT3bmypHpd8dLcKY",
    authDomain: "saem-security-5d2b5.firebaseapp.com",
    projectId: "saem-security-5d2b5",
    storageBucket: "saem-security-5d2b5.firebasestorage.app",
    messagingSenderId: "513970972570",
    appId: "1:513970972570:web:a1f400127b7e9318dc7c23"
  };

  const SESSION_KEY = "saem_logged_this_session";
  const GEO_CACHE_KEY = "saem_geo_cache";
  const BOT_UA_REGEX = /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegrambot|preview|lighthouse|pagespeed/i;

  if (!window.firebase) {
    console.warn("Firebase SDK is not loaded, firebase-log.js did not execute.");
    return;
  }

  function isBot() {
    return BOT_UA_REGEX.test(navigator.userAgent || '');
  }

  function safeGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {  }
  }

  if (safeGet(SESSION_KEY) === "1") return;
  if (isBot()) return;

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  function getGeoInfo() {
    const cached = safeGet(GEO_CACHE_KEY);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        return Promise.resolve({
          ip: data.ip || null,
          country: data.country || null,
          city: data.city || null,
        });
      } catch (e) {  }
    }

    return fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.success === false) return {};
        return {
          ip: data.ip || null,
          country: data.country || null,
          city: data.city || null,
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
          screen: window.screen.width + "x" + window.screen.height,
          userAgent: navigator.userAgent,
          ip: geo.ip || null,
          country: geo.country || null,
          city: geo.city || null,
        })
        .then(() => {
          safeSet(SESSION_KEY, "1");
        })
        .catch((err) => console.error("Logging error:", err));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    logVisit();
  });
})();