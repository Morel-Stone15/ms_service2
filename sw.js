const CACHE_NAME = 'ms-service-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/auth.js',
  '/login.html',
  '/register.html',
  '/dashboard.html',
  '/admin.html',
  '/icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use no-cache fetch to ensure we don't cache broken versions initially
      const promises = ASSETS.map(asset => {
        return fetch(new Request(asset, { cache: 'reload' }))
          .then(response => {
            if (response.ok) {
              return cache.put(asset, response);
            }
            throw new Error(`Failed to fetch ${asset}`);
          })
          .catch(err => console.warn('PWA Asset cache skip:', err));
      });
      return Promise.all(promises);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Pass non-GET requests directly
  if (e.request.method !== 'GET') return;

  // Pass API requests directly
  if (e.request.url.includes('/api/')) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
