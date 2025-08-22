// sw.js

const CACHE_NAME = 'titanos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/js/errors.js',
  '/assets/js/homescreen.js',
  '/assets/js/map.js',
  '/assets/js/missioncards.js',
  '/assets/js/activemissions.js',
  '/assets/js/header.js',
  '/assets/js/navigation.js',
  '/assets/js/bootscreen.js',
  '/assets/js/loginscreen.js',
  '/assets/js/performance.js',
  '/assets/js/router.js',
  '/assets/js/webgl-utils.js',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  '/assets/images/icon-180.png',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png',
  '/assets/images/icon-192-maskable.png',
  '/assets/images/icon-512-maskable.png'
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