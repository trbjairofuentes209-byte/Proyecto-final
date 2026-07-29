document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.getElementById("btnMenu");
    const navMenu = document.getElementById("navMenu");

    if (btnMenu && navMenu) {
        btnMenu.addEventListener("click", () => {
            navMenu.classList.toggle("activo");
        });
    }
});