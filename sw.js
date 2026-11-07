self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      body: event.data ? event.data.text() : ''
    };
  }

  const title = data.title || 'طلب جديد - مطعم العمدة';

  const options = {
    body: data.body || 'وصل طلب جديد إلى لوحة الكاشير.',
    tag: data.tag || 'new-order',
    data: {
      url: data.url || self.registration.scope
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clients => {
      for (const client of clients) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      return self.clients.openWindow(
        event.notification.data.url
      );
    })
  );
});
