console.log('SERVICEWORKER');
const STATIC = 'staticv1';
const STATIC_LIMIT = 15;
const INMUTABLE = 'inmutablev1';
const DYNAMIC = 'dynamicv1';
const DYNAMIC_LIMIT = 30
const APP_SHELL = [
    '/',
    '/index.html',
    'css/styles.css',
    'img/img2.jpg',
    'js/app.js',
    '/pages/offline.html'
];
let flag = undefined;

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js'
];

self.addEventListener('install', e => {
    console.log('INSTALADO');
    const staticCache = caches.open(STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const inmutableCache = caches.open(INMUTABLE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', e => {
    console.log('ACTIVADO'); 
});

self.addEventListener('push', e => {
    console.log('NOTIFICACIÓN PUSH');
});

self.addEventListener('sync', e => {
    console.log('SYNC EVENT');
});

self.addEventListener('fetch', async e => {
    //3.- Network with cache fallback - Siempre actualizada cuando hay internet
    const source = fetch(e.request).then(res => {
        if(!res) throw Error('Not found');
        caches.open(DYNAMIC).then(cache => {
            cache.put(e.request, res);
        });

        return res.clone();
    }).catch(() => {
        let regex = /\/pages/g;
        if(regex.test(e.request.url)) {
            return caches.match('./pages/offline.html');
        } else {
            return caches.match(e.request);          
        }
    });

    e.respondWith(source);
});

//self.addEventListener('fetch', e => {
    // 1.- Cache only - Toda la aplicacion será servida desde el caché
    //e.respondWith(caches.match(e.request));

    // 2.- Caché network fallback - Todo se encuentra en caché y si lo encuentra, recurre a la url
    // const source = caches.match(e.request).then(res => {
    //     if(res) return res;
    //     return fetch(e.request).then(resFetch => {
    //         caches.open(DYNAMIC).then(cache => {
    //             cache.put(e.request, resFetch);
    //         });

    //         return resFetch.clone();
    //     });
    // });

    // e.respondWith(source);

    //3.- Network with cache fallback - Siempre actualizada cuando hay internet
    // const source = fetch(e.request).then(res => {
    //     if(!res) throw Error('Not found');
    //     caches.open(DYNAMIC).then(cache => {
    //         cache.put(e.request, res);
    //     });

    //     return res.clone();
    // }).catch(err => {
    //     return caches.match(e.request);
    // });

    // e.respondWith(source);

    // 4.- Cache with network update - Usada cuando el rendimiento es bajo y siempre está una actualización detrás
    // if(e.request.url.includes('bootstrap'))
    //     return e.respondWith(caches.match(e.request));
    // const source = caches.open(STATIC).then(cache => {
    //     fetch(e.request).then(res => {
    //         cache.put(e.request, res);
    //     });
    //     return cache.match(e.request);
    // });

    // e.respondWith(source);

    // 5.- Caché and network race - 
    // const source = new Promise((res, rej) => {
    //     let flag = false;
    //     const failsOnce = () => {
    //         let reg = /\.(png|jpg)/g;
    //         if(flag) {
    //             if(reg.test(e.request.url)) {
    //                 resolve(caches.match('/img/not-found.png'));
    //             } else {
    //                 throw Error('SourceNotFound');
    //             }
    //         } else {
    //             flag = true;
    //         }
    //     }

    //     fetch(e.request).then(r => {
    //         r.ok ? res(r) : failsOnce();
    //     }).catch(failsOnce);

    //     caches.match(e.request).then(cr => {
    //         cr.ok ? res(cr) : failsOnce();
    //     }).catch(failsOnce);
    // });

    // e.respondWith(source);
//});

