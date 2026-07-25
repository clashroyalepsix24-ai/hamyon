// Hamyon — offline service worker
const C = "hamyon-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./index.html"])));
  self.skipWaiting();
});
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(r => r ||
      fetch(e.request).then(resp => {
        const cp = resp.clone();
        caches.open(C).then(c => c.put(e.request, cp));
        return resp;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
