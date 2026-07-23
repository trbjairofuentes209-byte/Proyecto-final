import { supabase } from "./config.js";

const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensajeLogin");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    console.log("Correo:", correo);
console.log("Contraseña:", password);

    const { data, error } = await supabase.auth.signInWithPassword({

        email: correo,
        password: password

    });

   if (error) {

    mensaje.textContent = error.message;
    mensaje.style.color = "red";

    return;

}

mensaje.textContent = "✔ Bienvenido.";

mensaje.style.color = "green";

setTimeout(() => {

    window.location.href = "dashboard.html";

}, 1500);

    window.location.href = "dashboard.html";

});