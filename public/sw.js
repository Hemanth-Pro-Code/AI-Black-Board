// BlackBoard AI - Production Service Worker
// Version: blackboard-ai-v1

const CACHE_VERSION = "blackboard-ai-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const PRECACHE_ASSETS = [
  "/",
  "/board",
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-16x16.png",
  "/icons/icon.svg",
];

// Install Event: Precache application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        // Use individual add/catch so single asset failure does not abort install
        return Promise.allSettled(
          PRECACHE_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SW] Precache skipped for ${url}:`, err.message);
            })
          )
        );
      })
      .then(() => {
        console.log(`[SW] ${STATIC_CACHE} installed successfully.`);
      })
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
              console.log(`[SW] Deleting legacy cache: ${key}`);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => {
        console.log(`[SW] Activated and claiming clients for ${CACHE_VERSION}`);
        return self.clients.claim();
      })
  );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-HTTP/HTTPS schemes (e.g. chrome-extension://)
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // 1. STRICT NETWORK ONLY FOR API REQUESTS (Do NOT cache AI/OCR/Export/API)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        // Graceful offline fallback for API requests
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "You are currently offline. An active internet connection is required for AI solving and online services.",
            offline: true,
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // 2. ONLY Cache GET requests (Ignore POST, PUT, DELETE, etc.)
  if (request.method !== "GET") {
    return;
  }

  // 3. Navigation requests (HTML pages): Network-First with Offline Cache Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Fallback to cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback to cached board or offline page
          const boardFallback = await caches.match("/board");
          if (boardFallback) {
            return boardFallback;
          }

          const offlineFallback = await caches.match("/offline");
          if (offlineFallback) {
            return offlineFallback;
          }

          return new Response("BlackBoard AI is offline. Please check your connection.", {
            headers: { "Content-Type": "text/plain" },
          });
        })
    );
    return;
  }

  // 4. Static assets (/_next/static, /icons, /fonts, images): Cache-First with Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".js");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => null);

        // Return cached if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 5. Default GET requests: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Update Handling: Skip waiting when requested by client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[SW] Received SKIP_WAITING signal, skipping wait...");
    self.skipWaiting();
  }
});
