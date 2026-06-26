// ১. ফায়ারবেস ভার্সন ৮ এর লাইব্রেরি ইমপোর্ট (আপনার অ্যাপের ভার্সন অনুযায়ী)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// ২. আপনার নিজস্ব ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyDNGTIl2O6AjsRNBfSyFTQMF0e0r5xdLNg",
  authDomain: "madrasa-apps-7ecbc.firebaseapp.com",
  databaseURL: "https://madrasa-apps-7ecbc-default-rtdb.firebaseio.com",
  projectId: "madrasa-apps-7ecbc",
  storageBucket: "madrasa-apps-7ecbc.firebasestorage.app",
  messagingSenderId: "636489314088",
  appId: "1:636489314088:web:d437f3e9f6bc7263b36a1d",
  measurementId: "G-FDEJQ978JV"
};

// ৩. ফায়ারবেস অ্যাপ চালু করা
firebase.initializeApp(firebaseConfig);

// ৪. মেসেজিং ইঞ্জিন সচল করা
const messaging = firebase.messaging();

// ৫. ব্যাকগ্রাউন্ড নোটিফিকেশন হ্যান্ডলার (যখন মোবাইল লক বা অ্যাপ বন্ধ থাকবে)
messaging.onBackgroundMessage((payload) => {
  console.log('ব্যাকগ্রাউন্ডে নোটিফিকেশন এসেছে: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icon.png', // আপনার অ্যাপের কোনো লোগো থাকলে তার লিংক এখানে দিতে পারেন
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
