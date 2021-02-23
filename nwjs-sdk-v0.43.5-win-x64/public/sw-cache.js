var VERSION = 'v3';

// 缓存
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/editor.html',
        '/favicon.ico',
        '/manifest.json',
        '/static/TCaptcha.js',
        '/static/analytics.js',
        '/static/await-signals-0.1.1.js',
        '/static/bot.js',
        '/static/jquery.js',
        '/static/microsoft.cognitiveservices.speech.sdk.bundle.js',
        '/static/mind.core.js',
        '/static/mind.min-c8aec501.js',
        '/static/mind.ui.js',
        '/static/mind.util.js',
        '/static/tcaptcha-frame.a62693b0.js',
        '/static/zhuge.min.js',
        '/static/datepicker-c8aec501.css',
        '/static/global-c8aec501.css',
        '/static/icons.css',
        '/static/markdown-po-c8aec501.css',
        '/static/mind.css',
        '/static/59118983e4b0f320c44f53ef.png',
        '/static/basic.png',
        '/static/black.jpg',
        '/static/ch.jpg',
        '/static/chl.jpg',
        '/static/chp.jpg',
        '/static/colorlines.png',
        '/static/dark.jpg',
        '/static/empty_user.svg',
        '/static/font_45680_r8r0bvoo0vf.woff2',
        '/static/jbxt.jpg',
        '/static/jysw.jpg',
        '/static/mindmap.jpg',
        '/static/mindmap1.jpg',
        '/static/mr.jpg',
        '/static/npz.jpg',
        '/static/paper.jpg',
        '/static/red.jpg',
        '/static/simple.jpg',
        '/static/wdmx.jpg',
        '/static/zxjx.jpg',
        '/images/android-chrome-192x192.png',
        '/images/android-chrome-512x512.png',
        '/images/android-chrome-maskable-192x192.png',
        '/images/screenshot1.png',
        '/images/screenshot2.png',
        '/images/screenshot3.png'
      ]);
    })
  );
});

// 缓存更新
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // 如果当前版本和缓存版本不一致
          if (cacheName !== VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 捕获请求并返回缓存数据
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request, {ignoreSearch: true}).catch(function() {
    return fetch(event.request);
  }).then(function(response) {
    caches.open(VERSION).then(function(cache) {
      cache.put(event.request, response).catch(function(e) {});
    });
    return response.clone();
  }).catch(function(e) {
//    return caches.match('/static/59118983e4b0f320c44f53ef.png');
    return fetch(event.request);
  }));
});