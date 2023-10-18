console.log('APPJS');
const url = window.location.href;
const api = `http://localhost:3000/api`;
let swLocation = '/practica_4_PWA/sw.js';
if(navigator.serviceWorker) {
    if(url.includes('localhost') || url.includes('127.0.0.1')) {
        swLocation = '/sw.js';       
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker.register(swLocation).then(reg => {
            //code
        });
    });
}