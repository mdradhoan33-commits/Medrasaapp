const CACHE_NAME = 'madrasa-app-v10'; // ⚠️ নতুন কোড আপলোডের সময় শুধু এই ভার্সনটি বদলাবেন (যেমন v7, v8)
const ASSETS = [
  '/',
  '/index.html',
  '/all.min.css',
  '/tailwind.min.js',
  '/manifest.json'
];

// ১. ইন্সটল এবং সাথে সাথে অ্যাক্টিভেট করা
self.addEventListener('install', (event) => {
  self.skipWaiting(); // নতুন আপডেট আসলে সাথে সাথে ইন্সটল হবে
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ২. পুরোনো ভার্সনের ক্যাশ সম্পূর্ণ ডিলিট করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // পুরোনো ভার্সন ডিলিট
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ৩. মেইন ম্যাজিক: Network First (লাইভ সার্ভার আগে, না পেলে ক্যাশ)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // সার্ভিস ওয়ার্কার ফাইলকে ক্যাশ থেকে বাঁচানোর জন্য
  if (requestUrl.pathname.includes('sw.js')) {
    return;
  }

  if (event.request.method === 'GET') {
    event.respondWith(
      // প্রথমে সরাসরি নেটলিফাই সার্ভার (Network) থেকে নতুন ফাইল আনার চেষ্টা করবে
      fetch(event.request)
        .then((networkResponse) => {
          // ইন্টারনেট থাকলে এবং রেসপন্স ঠিক থাকলে, নতুন ফাইলটা ক্যাশে সেভ করবে এবং স্ক্রিনে দেখাবে
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // যদি ইন্টারনেট না থাকে (Offline), তখন ক্যাশ থেকে ফাইলগুলো দেখাবে
          return caches.match(event.request);
        })
    );
  }
});
