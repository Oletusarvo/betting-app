self.addEventListener('install', e => {
    console.log('Service worker has been installed!');
});

self.addEventListener('activate', e => {
    console.log('Service worker has been activated!');
});

self.addEventListener('fetch', e => {
    console.log('Fetch event', e);
});