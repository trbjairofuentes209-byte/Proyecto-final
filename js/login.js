import { supabase } from "./config.js";

const formulario = document.getElementById("formLogin");
const mensaje = document.getElementById("mensajeLogin");

formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    // 1. Ocultar el teclado en celulares al enviar el formulario
    if (document.activeElement) {
        document.activeElement.blur();
    }

    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    // Obtener el botón de envío
    const btnSubmit = formulario.querySelector("button[type='submit']");
    const textoOriginalBtn = btnSubmit.innerHTML;

    // 2. Estado de carga (Mejora la experiencia en redes móviles lentas)
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Cargando...`;
    mensaje.textContent = "";

    // 3. Petición a Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password
    });

    if (error) {
        mensaje.textContent = "❌ " + error.message;
        mensaje.style.color = "#f87171"; // Rojo claro visible sobre fondo oscuro
        
        // Restaurar el botón para intentar de nuevo
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = textoOriginalBtn;
        return;
    }

    // 4. Éxito y redirección limpia
    mensaje.textContent = "✔ Bienvenido. Entrando...";
    mensaje.style.color = "#4ade80"; // Verde claro visible sobre fondo oscuro

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1200);
});