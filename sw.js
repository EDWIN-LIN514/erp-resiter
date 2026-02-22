const CACHE_NAME = 'sga-v2-force-refresh';
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Limpiando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediatamente
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
