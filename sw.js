// sw.js
const CACHE_NAME = 'artificial-talented-v3'; // bump to bust old caches
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Helper to check if a request is for an external resource
function isExternalRequest(url) {
  return new URL(url).origin !== location.origin;
}

// Small helper to normalize requests
function normalizeRequest(request) {
  // For external requests, force cors mode
  if (isExternalRequest(request.url)) {
    return new Request(request.url, {
      method: 'GET',
      headers: request.headers,
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy
    });
  }
  
  // For all requests (including navigation), ensure redirect mode is 'follow'
  if (request.redirect !== 'follow') {
    return new Request(request.url, {
      method: request.method,
      headers: request.headers,
      mode: request.mode,
      credentials: request.credentials,
      cache: request.cache,
      redirect: 'follow',
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity
    });
  }
  return request;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const normalizedRequest = normalizeRequest(event.request);
    const isExternal = isExternalRequest(event.request.url);
    const isNav = normalizedRequest.mode === 'navigate';
    
    try {
      // First try cache (except for external and navigation requests)
      if (!isExternal && !isNav) {
        const cached = await caches.match(normalizedRequest, { ignoreSearch: true });
        if (cached) return cached;
      }

      // Try network
      const networkResponse = await fetch(normalizedRequest);

      // Cache successful responses (except external resources)
      if (!isExternal && networkResponse.status === 200) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(normalizedRequest, networkResponse.clone());
      }

      return networkResponse;
    } catch (e) {
      // Fallback to cache when offline
      if (!isNav) {
        const fallback = await caches.match(normalizedRequest, { ignoreSearch: true });
        if (fallback) return fallback;
      }
      throw e;
    }
  })());
});

