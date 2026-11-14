// Service worker : permet de jouer hors ligne après la première ouverture.
var CACHE='jeu-de-coach-v1';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(CORE.map(function(u){return c.add(new Request(u,{mode:u.indexOf('http')===0?'no-cors':'same-origin'})).catch(function(){})}))
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(hit){
    return hit||fetch(e.request).then(function(r){
      var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy)}).catch(function(){});return r
    }).catch(function(){return e.request.mode==='navigate'?caches.match('./index.html'):new Response('',{status:503})});
  }));
});
