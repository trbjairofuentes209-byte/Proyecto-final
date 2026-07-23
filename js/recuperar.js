import { supabase } from "./config.js";

const formulario = document.getElementById("formRecuperar");
const mensaje = document.getElementById("mensajeRecuperar");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const correo = document.getElementById("correo").value;

    const { error } = await supabase.auth.resetPasswordForEmail(correo, {

        redirectTo: "http://127.0.0.1:5500/nueva-password.html"

    });

    if (error) {

        mensaje.textContent = error.message;
        mensaje.style.color = "red";
        return;

    }

    mensaje.textContent = "✔ Se ha enviado un enlace para recuperar tu contraseña.";
    mensaje.style.color = "green";

    formulario.reset();

});