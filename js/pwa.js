if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker

            .register("./service-worker.js")

            .then(() => {

                console.log("✅ PWA instalada correctamente.");

            })

            .catch(error => {

                console.error("Error al registrar el Service Worker:", error);

            });

    });

}