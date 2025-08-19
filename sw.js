const CACHE_NAME = 'artificial-talented-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/intro.html',
  '/name.html',
  '/questions.html',
  '/onboard-settings.html',
  '/generator.html',
  '/settings.html',
  '/style.css',
  '/js/index.js',
  '/js/intro.js',
  '/js/name.js',
  '/js/questions.js',
  '/js/onboard-settings.js',
  '/js/generator.js',
  '/js/settings.js',
  '/js/pwa.js',
  '/js/theme.js',
  '/manifest.webmanifest',
  '/assets/logo.png',
  '/assets/logo-dark.png',
  '/assets/icon.png',
  '/assets/icon-dark.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
