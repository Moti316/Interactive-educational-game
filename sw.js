// sw.js — Service Worker for offline play.
// Strategy:
//   - Static app shell + assets: cache-first (instant after first visit)
//   - Drive/Google APIs + dynamic profile data: network-only (always fresh)
//
// Bump CACHE_VERSION on each release. Old caches are pruned on activate.

const CACHE_VERSION = 'chachmoni-v1.1.4';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './styles/global.css',
  './styles/components.css',
  // src/
  './src/app.js',
  './src/audio.js',
  './src/audio-cues.js',
  './src/backup.js',
  './src/browser-check.js',
  './src/celebration.js',
  './src/db.js',
  './src/photo-store.js',
  './src/pin-entry.js',
  './src/profiles.js',
  './src/settings.js',
  './src/storage.js',
  './src/tasks.js',
  './src/welcome.js',
  './src/worlds.js',
  './src/ui/avatar-picker.js',
  './src/ui/button.js',
  './src/templates/click-targets.js',
  './src/templates/double-click-reveal.js',
  './src/templates/drag-drop-match.js',
  './src/templates/hover-target.js',
  './src/templates/key-press.js',
  './src/templates/point-and-narrate.js',
  './src/templates/right-click-menu.js',
  './src/templates/type-word.js',
  './src/sync/drive-config.js',
  './src/sync/drive-auth.js',
  './src/sync/drive-sync.js',
  // fonts
  './assets/fonts/fonts.css',
  // mascot
  './assets/mascot/professor-chachmoni-standing-wave.svg',
  './assets/mascot/professor-chachmoni-pointing.svg',
  './assets/mascot/professor-chachmoni-celebrating.svg',
  './assets/mascot/professor-chachmoni-thinking.svg',
  './assets/mascot/professor-chachmoni-encouraging.svg',
  './assets/mascot/professor-chachmoni-sleeping.svg',
  // icons
  './assets/icons/favicon.svg',
];

// Network-only patterns (NEVER cache these)
const NETWORK_ONLY_PATTERNS = [
  /accounts\.google\.com/,
  /www\.googleapis\.com/,
  /oauth2\.googleapis\.com/,
  /fonts\.gstatic\.com/,    // fonts now self-hosted; if any external still hit, network-only
  /fonts\.googleapis\.com/,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[sw] precache failed (some assets may not exist yet):', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-only for OAuth/Drive/external APIs
  if (NETWORK_ONLY_PATTERNS.some((p) => p.test(url.href))) return;

  if (url.origin !== location.origin) return;  // external: no interception

  // Code (HTML/CSS/JS/JSON/manifest) → network-first.
  // Ensures `git pull` + reload shows new code, never stale cache.
  // Falls back to cache only when offline.
  const isCode = /\.(html|css|js|mjs|json|webmanifest)$/i.test(url.pathname)
              || url.pathname === '/' || url.pathname.endsWith('/');

  if (isCode) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => caches.match(req))  // offline fallback
    );
    return;
  }

  // Assets (fonts, images, audio) → cache-first (immutable, ship-versioned).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// Message handler — allow the page to ask SW to clear its cache (post-OAuth-change, etc.)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => event.ports[0] && event.ports[0].postMessage({ ok: true }));
  }
});
