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
        mensaje.style.display = "block";
        return;
    }



const usuario = data.user;

const { error: errorPerfil } = await supabase
    .from("perfiles")
    .insert([
        {
            id: usuario.id,
            nombre: nombre,
            empresa: "",
            foto: ""
        }
    ]);

if (errorPerfil) {
    console.error("Error al crear el perfil:", errorPerfil);
}

    mensaje.textContent = "✔ Cuenta creada correctamente.";
    mensaje.style.color = "green";
    mensaje.style.display = "block";

    formulario.reset();

console.log(data);

});