// Service Worker — Loup-Garou PWA
const CACHE = 'loupgarou-v4';

const HTML_PAGES = [
  'index.html',
  'lobby.html',
  'role.html',
  'master.html',
];

const STATIC_ASSETS = [
  'style.css',
  'app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(['./', ...HTML_PAGES, ...STATIC_ASSETS]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Firebase et googleapis : toujours réseau
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis') || url.hostname.includes('google')) {
    return;
  }

  const isHTML = HTML_PAGES.some(p => url.pathname.endsWith(p)) || url.pathname.endsWith('/');

  if (isHTML) {
    // Network-first pour les pages HTML : garantit la version la plus récente
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first pour les assets statiques (CSS, JS, icônes)
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
  }
});
