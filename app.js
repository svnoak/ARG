
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then((reg) => console.log('service worker registered', reg)).catch((error) => console.log('service worker not registered', error));
}



Notification.requestPermission(status => {
    console.log('notification permission status:' , status)
});

if(Notification.permission === 'granted'){
 //  alert('we have permission');
testNotification();
}

function testNotification(){
    const notification = new Notification("new message from game", {
        body: "the game is telling you to play the game more!"
    });
}

/*

function showNotification() {
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification('sw registered')
        });
      }
    });
  }

  */

