const CACHE_NAME = "qpi-cache-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./questions.js",
    "./manifest.json"
];

// Install Service Worker
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("QPI: Files cached successfully.");
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(cacheNames => {

            return Promise.all(
                cacheNames
                    .filter(cacheName => cacheName !== CACHE_NAME)
                    .map(cacheName => caches.delete(cacheName))
            );

        })
    );

    self.clients.claim();
});

// Fetch Files
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);
            })

    );
});