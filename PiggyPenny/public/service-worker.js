const CACHE_NAME = 'pages-cache-v3';

const filesToCache = [
  '/',
  '/Styles/style.css',
  '/Styles/styleNavbar.css',
  '/Styles/styleOverview.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/fallback.html'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Adding static files to cache');
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting(); // Forza l'attivazione immediata del nuovo SW
});

// Attivazione del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Prende il controllo della pagina subito dopo l'attivazione
});

// Gestione della cache per le richieste fetch (strategia Cache First)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('apis.google.com')) {
    console.log('Google API request, skipping service worker for:', event.request.url);
    return;
  }

  // Solo per richieste GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve dalla cache se disponibile
      if (response) {
        console.log('Serving from cache:', event.request.url);
        return response;
      }

      // Altrimenti tenta di recuperare dalla rete
      console.log('Fetching from network:', event.request.url);
      return fetch(event.request).then((networkResponse) => {
        // Verifica se la risposta è valida
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type === 'basic' && 
          networkResponse.headers.get('content-type').includes('text/html')
        ) {
          return networkResponse; // Restituisci la risposta ma non metterla in cache
        }

        // Clona la risposta e la mette in cache
        let responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return networkResponse;
      }).catch(() => {
        // Se il fetch fallisce, mostra il fallback per richieste HTML
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/fallback.html');
        }
      });
    })
  );
});

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  console.log('Push notification received:', data);

  const options = {
    body: data.body || 'Notifica senza contenuto',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Notifica', options));
});

// Gestione del click sulle notifiche push
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Aggiornamento della versione dell'app (gestione controllerchange)
self.addEventListener('controllerchange', () => {
  console.log('Nuova versione disponibile. Aggiorna l\'app per nuove funzionalità!');
});
