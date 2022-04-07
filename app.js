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