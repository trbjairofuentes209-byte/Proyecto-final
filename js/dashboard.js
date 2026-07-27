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


const { data: productos, error: errorProductos } = await supabase
    .from("productos")
    .select("*");

if (errorProductos) {

    console.error(errorProductos);

} else {

    document.getElementById("totalProductos").textContent =
        productos.length;

}


let stock = 0;

productos.forEach(producto => {

    stock += producto.cantidad;

});

document.getElementById("stockTotal").textContent = stock;



const { data: categorias, error: errorCategorias } = await supabase
    .from("Categorias")
    .select("*");

if (errorCategorias) {

    console.error(errorCategorias);

} else {

    document.getElementById("totalCategorias").textContent =
        categorias.length;

}


const productosStockBajo = productos.filter(producto => producto.cantidad <= 10);

document.getElementById("stockBajo").textContent = productosStockBajo.length;



let valorInventario = 0;

productos.forEach(producto => {

    valorInventario += producto.precio * producto.cantidad;

});

document.getElementById("valorInventario").textContent =
    "$" + valorInventario.toFixed(2);

    

    const listaStockBajo = document.getElementById("listaStockBajo");

productos
    .filter(producto => producto.cantidad <= 10)
    .forEach(producto => {

        const item = document.createElement("li");

        item.textContent =
            `${producto.nombre} (${producto.cantidad})`;

        listaStockBajo.appendChild(item);

    });