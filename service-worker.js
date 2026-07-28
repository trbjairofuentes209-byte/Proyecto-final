const CACHE_NAME = "smartinventory-v1";

const archivos = [

    "./",

    // HTML
    "./index.html",
    "./login.html",
    "./registro.html",
    "./recuperar.html",
    "./nueva-password.html",
    "./dashboard.html",
    "./productos.html",
    "./categorias.html",
    "./crear.html",
    "./editar.html",
    "./ventas.html",
    "./perfil.html",
    "./buscador.html",

    // CSS
    "./css/style.css",
    "./css/login.css",
    "./css/registro.css",
    "./css/recuperar.css",
    "./css/nueva-password.css",
    "./css/dashboard.css",
    "./css/productos.css",
    "./css/categorias.css",
    "./css/crear.css",
    "./css/editar.css",
    "./css/ventas.css",
    "./css/perfil.css",
    "./css/buscador.css",

    // JavaScript
    "./js/config.js",
    "./js/login.js",
    "./js/registro.js",
    "./js/recuperar.js",
    "./js/nueva-password.js",
    "./js/dashboard.js",
    "./js/productos.js",
    "./js/categorias.js",
    "./js/crear.js",
    "./js/editar.js",
    "./js/ventas.js",
    "./js/perfil.js",
    "./js/buscador.js",

    // PWA
    "./manifest.json",

    // Iconos
    "./icons/favicon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => cache.addAll(archivos))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(response => response || fetch(event.request))

    );

});