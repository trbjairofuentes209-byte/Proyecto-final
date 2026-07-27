import { supabase } from "./config.js";

// 1. Verificar sesión activa
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
    window.location.href = "login.html";
}

// 2. Elementos del DOM
const selectProducto = document.getElementById("selectProducto");
const cantidadVentaInput = document.getElementById("cantidadVenta");
const btnRegistrarVenta = document.getElementById("btnRegistrarVenta");
const tablaVentas = document.getElementById("tablaVentas");

let listaProductos = [];

// 3. Inicializar la página al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    cargarSelectProductos();
    cargarHistorialVentas();
});

// 4. Cargar productos con stock disponible en el select
async function cargarSelectProductos() {
    const { data, error } = await supabase
        .from("productos")
        .select("*")
        .gt("cantidad", 0) // Solo productos con stock mayor a 0
        .order("nombre", { ascending: true });

    if (error) {
        console.error("Error al obtener productos:", error.message);
        return;
    }

    listaProductos = data;

    if (selectProducto) {
        selectProducto.innerHTML = '<option value="">-- Selecciona un producto --</option>';

        data.forEach(p => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = `${p.nombre} (Stock: ${p.cantidad} | Precio: $${p.precio})`;
            selectProducto.appendChild(option);
        });
    }
}
// 5. Registrar la venta y actualizar el stock
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

        // A) Descontar el stock en la tabla 'productos'
        const { error: errorStock } = await supabase
            .from("productos")
            .update({ cantidad: nuevoStock })
            .eq("id", productoId);

        if (errorStock) {
            alert("Error al actualizar el stock: " + errorStock.message);
            return;
        }

        // B) Registrar el historial en la tabla 'ventas'
        const { error: errorVenta } = await supabase
            .from("ventas")
            .insert([
                {
                    producto_id: producto.id,
                    nombre_productos: producto.nombre, // <-- Usar nombre_productos
                    cantidad: cantidadAVender,
                    total: totalVenta
                }
            ]);

        if (errorVenta) {
            alert("El stock se redujo, pero hubo un error al guardar la venta: " + errorVenta.message);
        } else {
            alert("¡Venta realizada con éxito!");
            cantidadVentaInput.value = 1;
            
            // Refrescar selector y tabla
            await cargarSelectProductos();
            await cargarHistorialVentas();
        }
    });
}

// 6. Cargar y mostrar el historial de ventas
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
        return;
    }

    ventas.forEach(v => {
        const fecha = new Date(v.created_at).toLocaleString();
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${fecha}</td>
            <td>${v.nombre_productos || 'Producto eliminado'}</td> <td>${v.cantidad}</td>
            <td>$${Number(v.total || 0).toFixed(2)}</td>
        `;

        tablaVentas.appendChild(fila);
    });
}