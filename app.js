/*
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then((reg) => console.log('service worker registered', reg)).catch((error) => console.log('service worker not registered', error));
}
*/

Notification.requestPermission(status => {
    console.log('notification permission status:' , status)
});

function displayNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(reg => {
            reg.showNotification('Hello world!');
        })
    }
}

displayNotification();