importScripts('assets/js/workbox-6.5.4/workbox-sw.js');

workbox.setConfig({
    debug: true,
    modulePathPrefix: 'assets/js/workbox-6.5.4/'
});

workbox.precaching.precacheAndRoute([
    {url: 'manifest.json', revision: '1.3'},
    {url: 'index.html', revision: '1'},
    {url: 'assets/css/ol.css', revision: '3'},
    {url: 'assets/css/jquery.mobile-1.4.5.css', revision: '1.4'},
    {url: 'assets/css/wapco-theme.css', revision: '1'},
    {url: 'assets/img/apple-touch-icon.png', revision: '1'},
    {url: 'assets/img/favicon-32x32.png', revision: '1'},
    {url: 'assets/img/favicon-16x16.png', revision: '1'},
    {url: 'assets/img/upload.gif', revision: '1'},
    {url: 'assets/img/ios7-close.png', revision: '1'},
    {url: 'assets/img/sat.gif', revision: '1'},
    {url: 'assets/img/wifioff.png', revision: '1'},
    {url: 'assets/img/network.png', revision: '1'},
    {url: 'assets/img/fire.gif', revision: '1'},
    {url: 'assets/js/jquery-2.2.4.min.js', revision: '1'},
    {url: 'assets/js/jquery.mobile-1.4.5.min.js', revision: '1'},
    {url: 'assets/js/proj4.js', revision: '1'},
    {url: 'assets/js/ol3/ol.js', revision: '1'},
    {url: 'assets/js/fastclick.js', revision: '1'},
    {url: 'assets/js/notify.min.js"', revision: '1'},
    {url: 'assets/js/config.js', revision: '1'},
    {url: 'assets/js/map.js', revision: '1'},
    {url: 'assets/js/mapbox_style.js', revision: '1'},
    {url: 'assets/js/alerts.js', revision: '1'},
    {url: 'assets/js/shake.js', revision: '1'},
    {url: 'assets/js/accelerometer.js', revision: '1'},
    {url: 'assets/js/camera.js', revision: '1'},
    {url: 'assets/js/index.js', revision: '1'},
], {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/]
});

