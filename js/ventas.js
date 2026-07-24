import { supabase } from "./config.js";

// Verificar sesión
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
    window.location.href = "login.html";
}

// Elementos del DOM
const selectCategoriaFiltro = document.getElementById("selectCategoriaFiltro");
const selectProducto = document.getElementById("selectProducto");
const cantidadVentaInput = document.getElementById("cantidadVenta");
const btnRegistrarVenta = document.getElementById("btnRegistrarVenta");
const tablaVentas = document.getElementById("tablaVentas");
const totalVentasAcumulado = document.getElementById("totalVentasAcumulado");

let listaProductos = [];
let listaCategorias = [];

// Inicializar datos
document.addEventListener("DOMContentLoaded", async () => {
    await cargarCategoriasFiltro();
    await cargarSelectProductos();
    await cargarHistorialVentas();
});

// 1. Cargar la lista de Categorías en el selector de filtro
async function cargarCategoriasFiltro() {
    if (!selectCategoriaFiltro) return;

    const { data, error } = await supabase
        .from("Categorias")
        .select("*")
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error al cargar categorías:", error.message);
        return;
    }

    listaCategorias = data;
    selectCategoriaFiltro.innerHTML = '<option value="">-- Todas las categorías --</option>';

    data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoriaFiltro.appendChild(option);
    });
}

// 2. Cargar todos los productos disponibles (con stock > 0)
async function cargarSelectProductos() {
    const { data, error } = await supabase
        .from("productos")
        .select("*, Categorias(*)") // Incluir relación con la tabla Categorias
        .gt("cantidad", 0)
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error al obtener productos:", error.message);
        return;
    }

    listaProductos = data;
    poblarSelectProductos(listaProductos);
}

// 3. Función auxiliar para pintar las opciones en el <select> de productos
function poblarSelectProductos(productos) {
    if (!selectProducto) return;

    selectProducto.innerHTML = '<option value="">-- Selecciona un producto --</option>';

    if (productos.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No hay productos disponibles";
        selectProducto.appendChild(option);
        return;
    }

    productos.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.nombre} (Stock: ${p.cantidad} | Precio: $${p.precio})`;
        selectProducto.appendChild(option);
    });
}

// 4. Filtrar productos cuando el usuario cambia la categoría seleccionada
if (selectCategoriaFiltro) {
    selectCategoriaFiltro.addEventListener("change", (e) => {
        const categoriaIdSeleccionada = e.target.value;

        if (!categoriaIdSeleccionada) {
            // Si elige "Todas las categorías", se muestran todos
            poblarSelectProductos(listaProductos);
        } else {
            // Filtrar según el ID de categoría (Categorias_id)
            const productosFiltrados = listaProductos.filter(
                p => p.Categorias_id == categoriaIdSeleccionada
            );
            poblarSelectProductos(productosFiltrados);
        }
    });
}

// 5. Registrar Venta
if (btnRegistrarVenta) {
    btnRegistrarVenta.addEventListener("click", async () => {
        const productoId = selectProducto.value;
        const cantidadAVender = parseInt(cantidadVentaInput.value, 10);

        if (!productoId || isNaN(cantidadAVender) || cantidadAVender <= 0) {
            alert("Por favor selecciona un producto y una cantidad válida.");
            return;
        }

        const producto = listaProductos.find(p => p.id == productoId);

        if (!producto) {
            alert("Producto no encontrado.");
            return;
        }

        if (cantidadAVender > producto.cantidad) {
            alert(`Stock insuficiente. Solo quedan ${producto.cantidad} unidades.`);
            return;
        }

        const nuevoStock = producto.cantidad - cantidadAVender;
        const totalVenta = producto.precio * cantidadAVender;

        // Descontar el stock en la tabla 'productos'
        const { error: errorStock } = await supabase
            .from("productos")
            .update({ cantidad: nuevoStock })
            .eq("id", productoId);

        if (errorStock) {
            alert("Error al actualizar el stock: " + errorStock.message);
            return;
        }

        // Registrar la transacción en 'ventas'
        const { error: errorVenta } = await supabase
            .from("ventas")
            .insert([
                {
                    producto_id: producto.id,
                    nombre_productos: producto.nombre,
                    cantidad: cantidadAVender,
                    total: totalVenta
                }
            ]);

        if (errorVenta) {
            alert("El stock se redujo, pero hubo un error al guardar la venta: " + errorVenta.message);
        } else {
            alert("¡Venta realizada con éxito!");
            cantidadVentaInput.value = 1;

            // Mantener o resetear el filtro tras la venta
            if (selectCategoriaFiltro) selectCategoriaFiltro.value = "";
            await cargarSelectProductos();
            await cargarHistorialVentas();
        }
    });
}

// 6. Cargar Historial de Ventas
async function cargarHistorialVentas() {
    if (!tablaVentas) return;

    const { data: ventas, error } = await supabase
        .from("ventas")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error al cargar ventas:", error.message);
        return;
    }

    tablaVentas.innerHTML = "";

    if (ventas.length === 0) {
        tablaVentas.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay ventas registradas aún.</td></tr>`;
        if (totalVentasAcumulado) totalVentasAcumulado.textContent = "$0.00";
        return;
    }

    const sumaTotal = ventas.reduce((acum, v) => acum + Number(v.total || 0), 0);
    if (totalVentasAcumulado) {
        totalVentasAcumulado.textContent = `$${sumaTotal.toFixed(2)}`;
    }

    ventas.forEach(v => {
        const fecha = new Date(v.created_at).toLocaleString();
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${fecha}</td>
            <td>${v.nombre_productos || 'Producto eliminado'}</td>
            <td>${v.cantidad}</td>
            <td>$${Number(v.total || 0).toFixed(2)}</td>
        `;

        tablaVentas.appendChild(fila);
    });
}