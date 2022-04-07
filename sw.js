//Install service worker event listener
self.addEventListener('install', ins => {
console.log('service worker has been installed');
});

//Activate service worker event listener
self.addEventListener('activate', act => {
    console.log('service worker has been activated');
});

//fetch events
self.addEventListener('fetch', req => {
  //  console.log('fetch event', req);

});
