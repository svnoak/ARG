if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').then((reg) => console.log('service worker registered', reg)).catch((error) => console.log('service worker not registered', error));
}

if('serviceWorker' in navigator){
navigator.serviceWorker.getRegistration().then(reg => {
    reg.pushManager.subscribe({
        userVisibleOnly: true
    }).then(sub => {
        // send sub.toJSON() to server
    });
});
}

Notification.requestPermission(status => {
    console.log('notification permission status:' , status)
});

function displayNotification() {
    if (Notification.permission === 'Granted') {
        navigator.serviceWorker.getRegistration().then(reg => {
            reg.showNotification('Hello world!');
        })
    }
}

displayNotification();