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

// Small helper to normalize navigation requests so redirects are followed
function normalizeRequest(request) {
  // Only tweak navigations; other requests can pass through as-is
  if (request.mode === 'navigate') {
    return new Request(request.url, {
      method: 'GET',
      headers: request.headers,
      // Keep same-origin; you can also use 'cors' if needed
      mode: 'same-origin',
      redirect: 'follow', // <- important
      credentials: request.credentials,
      cache: request.cache,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      integrity: request.integrity,
      keepalive: request.keepalive
    });
  }
  return request;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const normalizedRequest = normalizeRequest(event.request);
    const isNav = normalizedRequest.mode === 'navigate';
    
    try {
      // First try cache for non-nav requests
      if (!isNav) {
        const cached = await caches.match(normalizedRequest);
        if (cached) return cached;
      }

      // Try network with explicit redirect following
      const networkResponse = await fetch(normalizedRequest.url, {
        redirect: 'follow',
        headers: normalizedRequest.headers,
        method: normalizedRequest.method,
        credentials: normalizedRequest.credentials,
        cache: normalizedRequest.cache,
        referrer: normalizedRequest.referrer
      });

      // Cache successful non-nav responses
      if (!isNav && networkResponse.status === 200) {
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

