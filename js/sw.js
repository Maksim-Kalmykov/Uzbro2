const CACHE_NAME = 'uzbro-cache-v8';
const OFFLINE_URL = '/offline.html';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.json',
  '/favicon.svg',
  '/favicon.ico',
  '/icons/icon-512x512.png',
  '/icons/favicon-96x96.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192x192.png',
  // Изображения (правильные пути!)
  '/images/1-1.jpg',
  '/images/10.jpg',
  '/images/1.png',
  '/images/3.png',
  '/images/5.png',
  '/images/6.png',
  '/images/master.png',
  '/images/qr-uzbro2.jpg',
  '/images/max.svg',
  // JS
  '/js/particles.min.js',
  // Шрифты Inter
  '/fonts/Inter-Regular.woff2',
  '/fonts/Inter-Regular.woff',
  '/fonts/Inter-Italic.woff2',
  '/fonts/Inter-Italic.woff',
  '/fonts/Inter-Medium.woff2',
  '/fonts/Inter-Medium.woff',
  '/fonts/Inter-MediumItalic.woff2',
  '/fonts/Inter-MediumItalic.woff',
  '/fonts/Inter-SemiBold.woff2',
  '/fonts/Inter-SemiBold.woff',
  '/fonts/Inter-SemiBoldItalic.woff2',
  '/fonts/Inter-SemiBoldItalic.woff',
  '/fonts/Inter-Bold.woff2',
  '/fonts/Inter-Bold.woff',
  '/fonts/Inter-BoldItalic.woff2',
  '/fonts/Inter-BoldItalic.woff',
  '/fonts/Inter-ExtraBold.woff2',
  '/fonts/Inter-ExtraBold.woff',
  '/fonts/Inter-Black.woff2',
  '/fonts/Inter-Black.woff',
  // Font Awesome
  '/fonts/webfonts/fa-solid-900.woff2',
  '/fonts/webfonts/fa-regular-400.woff2',
  '/fonts/webfonts/fa-brands-400.woff2'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Установка, кэшируем файлы...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Кэшируем', FILES_TO_CACHE.length, 'файлов');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] ✅ Кэширование завершено');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] ❌ Ошибка кэширования:', err);
      })
  );
});

// NetworkFirst стратегия для yclients.com
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Нет соединения с сервером', { status: 503 });
  }
}

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Для yclients.com используем NetworkFirst
  if (url.includes('yclients.com')) {
    event.respondWith(networkFirst(event.request));
    return;
  }
  
  // Для 2GIS карты — заглушка
  if (url.includes('2gis.ru') || url.includes('makemap')) {
    event.respondWith(
      new Response('Карта недоступна в офлайн-режиме', { 
        status: 503, 
        headers: { 'Content-Type': 'text/plain; charset=utf-8' } 
      })
    );
    return;
  }
  
  // Остальные запросы — CacheFirst
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        if (event.request.destination === 'font') {
          return new Response('', { 
            status: 200, 
            headers: { 'Content-Type': 'font/woff2' } 
          });
        }
        return new Response('Нет соединения', { status: 503 });
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] 🗑️ Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim());
  console.log('[SW] ✅ Service Worker активирован');
});