/**
 * Service Worker - 离线缓存支持
 */
const CACHE_NAME = 'banwei-game-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/css/animations.css',
    '/js/main.js',
    '/js/config.js',
    '/js/events.js',
    '/js/game.js',
    '/js/storage.js',
    '/js/ui.js',
    '/js/achievements.js',
    '/js/endings.js',
    '/js/fortune.js',
    '/manifest.json'
];

/**
 * 安装Service Worker
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

/**
 * 激活Service Worker
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

/**
 * 请求拦截 - 缓存优先
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).then((response) => {
                // 不缓存非正常响应、非同源请求
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                // 只缓存同源 HTTP/HTTPS 请求
                if (event.request.url.startsWith('http')) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            });
        }).catch(() => {
            // 离线时返回离线页面
            return caches.match('/index.html');
        })
    );
});
