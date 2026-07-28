document.addEventListener("DOMContentLoaded", () => {
  const btnHamburguesa = document.getElementById("btn-hamburguesa");
  const btnCerrar = document.getElementById("btn-cerrar-menu");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay-menu");

  function abrirMenu() {
    if (sidebar) sidebar.classList.add("activo");
    if (overlay) overlay.classList.add("activo");
  }

  function cerrarMenu() {
    if (sidebar) sidebar.classList.remove("activo");
    if (overlay) overlay.classList.remove("activo");
  }

  if (btnHamburguesa) {
    btnHamburguesa.addEventListener("click", (e) => {
      e.stopPropagation();
      abrirMenu();
    });
  }

  if (btnCerrar) btnCerrar.addEventListener("click", cerrarMenu);
  if (overlay) overlay.addEventListener("click", cerrarMenu);
});