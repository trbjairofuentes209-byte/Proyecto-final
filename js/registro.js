import { supabase } from "./config.js";

const formulario = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensajeRegistro");

formulario.addEventListener("submit", async (event) => {

    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({

        email: correo,
        password: password,

        options: {
            data: {
                nombre: nombre
            }
        }

    });

    if (error) {

    mensaje.textContent = error.message;
    mensaje.style.color = "red";

    return;

}

mensaje.textContent = "✔ Cuenta creada correctamente.";
mensaje.style.color = "green";

formulario.reset();

console.log(data);

});