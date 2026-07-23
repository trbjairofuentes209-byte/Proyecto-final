import { supabase } from "./config.js";

const formulario = document.getElementById("formNuevaPassword");
const mensaje = document.getElementById("mensajePassword");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    if (password !== confirmarPassword) {

        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;

    }

    const { error } = await supabase.auth.updateUser({

        password: password

    });

    if (error) {

        mensaje.textContent = error.message;
        mensaje.style.color = "red";
        return;

    }

    mensaje.textContent = "✔ Contraseña actualizada correctamente.";
    mensaje.style.color = "green";

    setTimeout(() => {

        window.location.href = "login.html";

    }, 2000);

});