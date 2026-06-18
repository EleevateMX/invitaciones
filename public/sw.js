const CACHE_NAME = 'teinvitaron-v1';
const SHELL = ['/', '/login', '/precios', '/crear'];

// Install: cache shell
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(SHELL).catch(() => {}))
  );
});

// Activate: delete ALL old caches so updates propagate immediately
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API/auth/supabase; cache-first for static
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);
  // Skip non-GET and external/supabase/api calls
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) return;

  // Network-first for HTML pages (always fresh)
  if (request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }
  // Cache-first for static assets
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
        return res;
      });
    })
  );
});

// Push: show notification
self.addEventListener('push', (e) => {
  if (!e.data) return;
  let data;
  try { data = e.data.json(); } catch { data = { title: 'teinvitaron', body: e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(data.title || 'teinvitaron.site', {
      body: data.body || '',
      icon: data.icon || '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: data.tag || 'inv',
      data: { url: data.url || '/dashboard' },
      vibrate: [200, 100, 200],
    })
  );
});

// Notification click: open URL
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/dashboard';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const found = cs.find(c => c.url.includes(url));
      if (found) return found.focus();
      return clients.openWindow(url);
    })
  );
});

// Listen for SKIP_WAITING message
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
