// sw.js — robust install (skips missing files), same-origin only
const CACHE_NAME = 'a-and-t-v9';

// Same-origin files to precache (relative to scope)
const ASSETS = [
  'index.html','intro.html','name.html','questions.html',
  'onboard-settings.html','generator.html','settings.html',
  'style.css',
  'js/index.js','js/intro.js','js/name.js','js/questions.js',
  'js/onboard-settings.js','js/generator.js','js/settings.js',
  'js/pwa.js','js/theme.js','js/message.js',
  'assets/logo.png','assets/logo-dark.png','assets/icon.png','assets/icon-dark.png',
  'manifest.webmanifest'
];

const SCOPE = self.location.pathname.replace(/sw\.js$/, '');

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Fetch each asset individually; skip any that fail (404/CORS/etc.)
    const requests = ASSETS.map(p => new Request(SCOPE + p, { cache: 'reload' }));
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

  const rel = url.pathname.startsWith(SCOPE) ? url.pathname.slice(SCOPE.length) : url.pathname;

  // Navigations
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        if (net && net.ok) return net;
      } catch (err) {}
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(SCOPE + rel, { ignoreSearch: true });
      if (cached) return cached;
      const shell = await cache.match(SCOPE + 'index.html', { ignoreSearch: true });
      return shell || new Response('Offline', { status: 503 });
    })());
    return;
  }

  // Same-origin assets: cache-first then network (update cache on success)
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const net = await fetch(req);
      if (net && net.ok && net.type === 'basic') await cache.put(req, net.clone());
      return net;
    } catch (err) {
      return cached || Promise.reject(err);
    }
  })());
});

