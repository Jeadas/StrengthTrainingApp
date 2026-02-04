const CACHE_NAME = 'sta-v2';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/utils.js',
  './js/storage.js',
  './js/data.js',
  './js/timer.js',
  './js/ui.js',
  './js/app.js',
  './manifest-v2.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener('activate', (event) => { event.waitUntil(clients.claim()); });
