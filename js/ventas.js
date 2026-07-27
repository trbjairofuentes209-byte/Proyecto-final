import { supabase } from "./config.js";

// Verificar sesión
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
    window.location.href = "login.html";
}

// Elementos del DOM
const selectProducto = document.getElementById("selectProducto");
const cantidadVentaInput = document.getElementById("cantidadVenta");
const btnRegistrarVenta = document.getElementById("btnRegistrarVenta");
const tablaVentas = document.getElementById("tablaVentas");

let listaProductos = [];

// Inicializar datos
document.addEventListener("DOMContentLoaded", () => {
    cargarSelectProductos();
    cargarHistorialVentas();
});

// 1. Cargar productos disponibles en el selector
async function cargarSelectProductos() {
    const { data, error } = await supabase
        .from("productos")
        .select("*")
        .gt("cantidad", 0) // Solo productos con stock > 0
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error al obtener productos:", error.message);
        return;
    }

    listaProductos = data;
    selectProducto.innerHTML = '<option value="">-- Selecciona un producto --</option>';

    data.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.nombre} (Stock: ${p.cantidad} | Price: $${p.precio})`;
        selectProducto.appendChild(option);
    });
}

// 2. Registrar la venta y actualizar stock
btnRegistrarVenta.addEventListener("click", async () => {
    const productoId = selectProducto.value;
    const cantidadAVender = parseInt(cantidadVentaInput.value, 10);

    if (!productoId || isNaN(cantidadAVender) || cantidadAVender <= 0) {
        alert("Por favor selecciona un producto y una cantidad válida.");
        return;
    }

    // Buscar la información actual del producto seleccionado
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

    // A) Descontar el stock en la tabla 'productos'
    const { error: errorStock } = await supabase
        .from("productos")
        .update({ cantidad: nuevoStock })
        .eq("id", productoId);

    if (errorStock) {
        alert("Error al actualizar el stock: " + errorStock.message);
        return;
    }

    // B) Insertar el registro de la transacción en la tabla 'ventas'
    const { error: errorVenta } = await supabase
        .from("ventas")
        .insert([
            {
                producto_id: producto.id,
                nombre_producto: producto.nombre,
                cantidad: cantidadAVender,
                total: totalVenta
            }
        ]);

    if (errorVenta) {
        alert("El stock se redujo, pero hubo un error al guardar la venta: " + errorVenta.message);
    } else {
        alert("¡Venta realizada con éxito!");
        cantidadVentaInput.value = 1;
        
        // Recargar datos en la UI
        cargarSelectProductos();
        cargarHistorialVentas();
    }
});

// 3. Cargar el historial de ventas
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

    ventas.forEach(v => {
        const fecha = new Date(v.created_at).toLocaleString();
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${fecha}</td>
            <td>${v.nombre_producto}</td>
            <td>${v.cantidad}</td>
            <td>$${Number(v.total).toFixed(2)}</td>
        `;

        tablaVentas.appendChild(fila);
    });
}