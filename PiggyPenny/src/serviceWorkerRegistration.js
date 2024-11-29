//Determinazione del contesto locale (isLocalhost) per adattare la logica di registrazione del Service Worker, evitando problemi in ambienti di sviluppo.
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(\.[0-9]+){0,3}$/)
  );
  
  const registerValidSW = (swUrl) => {
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker registrato con successo:', registration);
  
        registration.onupdatefound = () => {
          console.log('Nuovo Service Worker trovato. In fase di installazione...');
  
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Mostra notifica o ricarica la pagina
                alert('Nuovo contenuto disponibile, ricarica la pagina.');
              } else {
                console.log('Contenuto precaricato per uso offline.');
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Registrazione del Service Worker fallita:', error);
      });
  };
  
  const checkValidServiceWorker = (swUrl) => {
    fetch(swUrl)
      .then((response) => {
        if (
          response.status === 404 ||
          response.headers.get('content-type')?.indexOf('javascript') === -1
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          registerValidSW(swUrl);
        }
      })
      .catch((error) => {
        console.error('Errore di rete durante la verifica del Service Worker:', error);
      });
  };
  
  export const register = () => {
    if ('serviceWorker' in navigator) {
      const swUrl = '/service-worker.js';
  
      if (isLocalhost) {
        checkValidServiceWorker(swUrl);
      } else {
        registerValidSW(swUrl);
      }
    }
  };
  
  export const unregister = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  };