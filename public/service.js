const cacheName = 'enceladus-v2';

addEventListener('fetch', (event) => {
  const eventRequest = event.request;

  if (eventRequest.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async function () {
      const fetchRequest = fetch(eventRequest);

      event.waitUntil(
        (async function () {
          const response = await fetchRequest;
          const clone = response.clone();
          const cache = await caches.open(cacheName);

          return cache.put(eventRequest, clone);
        })()
      );

      try {
        return await fetchRequest;
      } catch (error) {
        return caches.match(eventRequest);
      }
    })()
  );
});
