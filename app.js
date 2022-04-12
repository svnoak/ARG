
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then((reg) => console.log('service worker registered', reg)).catch((error) => console.log('service worker not registered', error));
}



Notification.requestPermission(status => {
    console.log('notification permission status:' , status)
});

if(Notification.permission === 'granted'){
    const greeting = new Notification('Hi, How are you?',{
        body: 'Have a good day'
      });
}


/*
function displayNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration('sw.js').then(reg => {
            reg.showNotification('Hello world!');
            console.log("hej hopp 1");
        })
    }
}
*/

function showNotification() {
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification('sw registered')
        });
      }
    });
  }

  showNotification();
