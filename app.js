/*
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then((reg) => console.log('service worker registered', reg)).catch((error) => console.log('service worker not registered', error));
}
*/


Notification.requestPermission(status => {
    console.log('notification permission status:' , status)
});


navigator.serviceWorker.getRegistration('sw.js').then(function(registration) {
    if(registration){
     console.log("sw registered");
    }
  });

