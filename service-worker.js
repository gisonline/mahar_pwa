importScripts('assets/vendor/workbox-6.5.4/workbox-sw.js');

workbox.setConfig({
    debug: true,
    modulePathPrefix: 'assets/vendor/workbox-6.5.4/'
});

workbox.precaching.precacheAndRoute([
    {url: 'manifest.json', revision: '1'},
    {url: 'index.html', revision: '1'},
    {url: 'assets/css/ol.css', revision: '3'},
    {url: 'assets/css/jquery.mobile-1.4.5.css', revision: '1.4'},
    {url: 'assets/css/wapco-theme.css', revision: '1'},
    {url: 'assets/js/jquery.min.js', revision: '2'},
    {url: 'assets/js/jquery.mobile-1.4.5.min.js', revision: '1'},
    {url: 'assets/js/jquery-3.7.0.min.js', revision: '2'},
    {url: 'assets/img/apple-touch-icon.png', revision: '1'},
    {url: 'assets/img/favicon-32x32.png', revision: '1'},
    {url: 'assets/img/favicon-16x16.png', revision: '1'},
    {url: 'assets/img/upload.gif', revision: '1'},
    {url: 'assets/img/ios7-close.png', revision: '1'},
    {url: 'assets/img/sat.gif', revision: '1'},
    {url: 'assets/img/wifioff.png', revision: '1'},
    {url: 'assets/img/network.png', revision: '1'},
    {url: 'assets/img/fire.gif', revision: '1'},
    {url: 'assets/vendor/sqljs-1.8.0/sql-wasm.js', revision: '10.27.22.1'},
    {url: 'assets/vendor/sqljs-1.8.0/sql-wasm.wasm', revision: '10.27.22.1'},
    {url: 'assets/vendor/localForage-1.10.0/localforage.min.js', revision: '09.15.21.1'},
    {url: 'assets/js/proj4.js', revision: '1'},
    {url: 'assets/js/ol3/ol.js', revision: '1'},
    {url: 'assets/js/fastclick.js', revision: '1'},
    {url: 'assets/js/notify.min.js', revision: '1'},
    {url: 'assets/js/mapbox_style.js', revision: '1'},
    {url: 'assets/js/config.js', revision: '1'},
    {url: 'assets/js/functions.js', revision: '1'},
    {url: 'assets/js/start.js', revision: '1'},
    {url: 'assets/js/awake.js', revision: '1'},
], {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/]
});

