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
    const isNav = event.request.mode === 'navigate';

    // For navigations, always fetch with redirect: 'follow' to avoid the manual/redirected clash
    if (isNav) {
      try {
        // Go straight to network and follow redirects. Do not cache navigations.
        return await fetch(event.request.url, { redirect: 'follow' });
      } catch (e) {
        // Offline SPA fallback
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) return cachedIndex;
        throw e;
      }
    }

    // Non-navigation requests: cache-first, then network
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const network = await fetch(event.request);

      // If server responded with a redirect (opaqueredirect or redirected), don't cache it, and
      // re-fetch the final URL with redirect: 'follow' so we return a non-redirected response.
      if (network.redirected || network.type === 'opaqueredirect') {
        return fetch(network.url, { redirect: 'follow' });
      }

      if (network && network.status === 200) {
        const copy = network.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, copy).catch(() => {});
      }

      return network;
    } catch (e) {
      // Last-ditch cache fallback (ignoring query string helps with hashed/cdn variants)
      const fallback = await caches.match(event.request, { ignoreSearch: true });
      if (fallback) return fallback;
      throw e;
    }
  })());
});

