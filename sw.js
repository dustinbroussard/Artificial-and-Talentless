// sw.js — robust install (skips missing files), same-origin only
const CACHE_NAME = 'a-and-t-v8';

// Same-origin files to precache
const ASSETS = [
  '/', '/index.html', '/intro.html', '/name.html', '/questions.html',
  '/onboard-settings.html', '/generator.html', '/settings.html',
  '/style.css',
  'js/index.js','js/intro.js','js/name.js','js/questions.js',
  'js/onboard-settings.js','js/generator.js','js/settings.js',
  'js/pwa.js','js/theme.js','js/message.js',
  '/assets/logo.png','/assets/logo-dark.png','/assets/icon.png','/assets/icon-dark.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Fetch each asset individually; skip any that fail (404/CORS/etc.)
    const requests = ASSETS.map(u => new Request(u, { cache: 'reload' }));
    const results = await Promise.allSettled(
      requests.map(async (req) => {
        try {
          const resp = await fetch(req);
          if (resp && resp.ok) {
            await cache.put(req, resp.clone());
          } else {
            // skip non-OK responses
            console.warn('[SW] Skipping (non-OK):', req.url, resp && resp.status);
          }
        } catch (err) {
          console.warn('[SW] Skipping (fetch failed):', req.url, err && err.message);
        }
      })
    );
    // optional: log how many succeeded
    const okCount = results.filter(r => r.status === 'fulfilled').length;
    console.log(`[SW] Precached OK: ${okCount}/${ASSETS.length}`);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const req = event.request;
  const url = new URL(req.url);

  // Let browser handle ALL cross-origin (CDNs, fonts, APIs)
  if (url.origin !== location.origin) return;

  // Navigations: online → network, offline → cached app shell
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(req);
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const shell = await cache.match('/index.html', { ignoreSearch: true });
        return shell || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // Cache-first for anything we precached
  if (ASSETS.includes(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      const net = await fetch(req);
      if (net && net.ok) (await caches.open(CACHE_NAME)).put(req, net.clone());
      return net;
    })());
    return;
  }

  // Network-first for other same-origin requests
  event.respondWith((async () => {
    try {
      const net = await fetch(req);
      if (net && net.ok) (await caches.open(CACHE_NAME)).put(req, net.clone());
      return net;
    } catch (err) {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      throw err;
    }
  })());
});

