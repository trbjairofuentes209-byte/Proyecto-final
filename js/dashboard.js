import { supabase } from "./config.js";

// Obtener la sesión actual
const { data } = await supabase.auth.getSession();

// Si no hay sesión, regresar al login
if (!data.session) {
    window.location.href = "login.html";
}

const usuario = data.session.user;

document.getElementById("usuarioActivo").textContent =
    `Bienvenido, ${usuario.email}`;

    const btnCerrarSesion = document.getElementById("cerrarSesion");

btnCerrarSesion.addEventListener("click", async (event) => {

    event.preventDefault();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error(error);
        return;
    }

    window.location.href = "login.html";

});