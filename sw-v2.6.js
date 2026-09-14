const CACHE_NAME = 'otview-v2.6';
const APP_SHELL = [
  './',
  './index.html',
  './OTView_v2_6.html',
  './manifest-v2.6.webmanifest',
  './icon-192-v2.6.png',
  './icon-512-v2.6.png',
  './apple-touch-icon-v2.6.png',
  './favicon-32-v2.6.png',
  './favicon-16-v2.6.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
