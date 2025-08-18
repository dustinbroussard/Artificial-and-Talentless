const CACHE_NAME = 'artificial-talented-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/name.html', 
  '/intro.html',
  '/questions.html',
  '/onboard-settings.html',
  '/generator.html',
  '/settings.html',
  '/manifest.webmanifest',
  '/assets/logo.png',
  '/assets/logo-dark.png',
  '/assets/icon.png',
  '/assets/icon-dark.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Special+Elite&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});
