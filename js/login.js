document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const passwordInput = document.getElementById('admin-password').value;
    const errorMessage = document.getElementById('error-message');

    // Tu contraseña de seguridad
    const contrasenaCorrecta = "HiblookAdmin2026"; 

    if (passwordInput === contrasenaCorrecta) {
        errorMessage.style.display = 'none';
        
        alert("¡Acceso concedido! Redireccionando al panel de administración...");
        
        // CAMBIA ESTA LÍNEA: Ahora apunta a tu nuevo archivo HTML
        window.location.href = "administracion.html"; 
    } else {
        // Muestra el error si se equivocan
        errorMessage.style.display = 'flex';
        
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
});