/**
 * Python Practical Hub - Service Worker
 * Cache-First Offline-Ready Strategy with GitHub Pages Subdirectory Support
 */

const CACHE_NAME = 'aisc-hub-v2';

// Relative assets list (relative to service worker location)
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/logo.svg'
];

// Optional binary assets that might be added
const OPTIONAL_ASSETS = [
  './downloads/python_practicals.zip'
];

// Install Event: Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[SW] Pre-caching core application shell');
      await cache.addAll(CORE_ASSETS);

      // Attempt to cache the ZIP file if present, but do not fail installation if not yet uploaded
      for (const asset of OPTIONAL_ASSETS) {
        try {
          const response = await fetch(asset);
          if (response.ok) {
            await cache.put(asset, response);
            console.log('[SW] Cached practicals ZIP archive:', asset);
          }
        } catch (e) {
          console.log('[SW] Optional asset not yet available during install:', asset);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache store:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First Strategy with Dynamic Fallback & Cache Updating
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for same origin or relative assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        // Return from cache immediately
        return cachedResponse;
      }

      // Not in cache, try network
      return fetch(event.request)
        .then((networkResponse) => {
          // If response is valid, dynamically cache a clone for offline use
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback when network fails and asset is not in cache
          // If navigation request, fallback to index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
