const CACHE_NAME = "patient-monitor-v1";
const urlsToCache = [
  "/",
  "/history",
  "/static/style.css",
  "/static/script.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
