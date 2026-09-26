// Offline support: keeps a copy of the app files so it opens without internet.
// Your expenses are NOT stored here - they live in the browser's localStorage.
// Bump VERSION whenever you want to force every device to drop its old cached copy.
const VERSION = 'v1';
const CACHE = 'money-manager-' + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('money-manager-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Only this site's own files; GitHub sync calls (api.github.com) always go straight to the network
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // Network first so updates show up as soon as you're online; cached copy when offline
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })
        .then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
        .then(hit => hit || Response.error()))
  );
});
