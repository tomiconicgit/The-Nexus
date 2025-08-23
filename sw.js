// sw.js

const CACHE_NAME = 'titanos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/js/errors.js',
  '/assets/js/homescreen.js',
  '/assets/js/header.js',
  '/assets/js/navigation.js',
  '/assets/js/bootscreen.js',
  '/assets/js/loginscreen.js',
  '/assets/js/router.js',
  '/assets/js/webgl-utils.js',
  '/assets/images/icon-180.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/icon-192-maskable.png',
  '/assets/images/icon-512-maskable.png',
  '/assets/images/network-graph.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});