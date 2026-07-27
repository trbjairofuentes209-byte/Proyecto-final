import { supabase } from "./config.js";

// Verificar sesión
const { data: sessionData } = await supabase.auth.getSession();
if (!sessionData.session) {
    window.location.href = "login.html";
}

// Elementos del DOM
const formCategoria = document.getElementById("form-crear-categoria");
const inputNombre = document.getElementById("nombre-categoria");
const inputId = document.getElementById("categoria-id");
const btnGuardar = document.getElementById("btn-guardar-cat");
const btnCancelar = document.getElementById("btn-cancelar-edicion");
const tituloForm = document.getElementById("titulo-form");
const tablaCategorias = document.getElementById("tablaCategorias");
const buscarInput = document.getElementById("buscarCategoria");

let listaCategorias = [];

// Cargar categorías al iniciar
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
});

// 1. Obtener categorías de Supabase
async function cargarCategorias() {
    const { data, error } = await supabase
        .from("Categorias")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error al cargar categorías:", error.message);
        return;
    }

    listaCategorias = data;
    renderizarTabla(listaCategorias);
}

// 2. Renderizar filas en la tabla
function renderizarTabla(categorias) {
    if (!tablaCategorias) return;
    tablaCategorias.innerHTML = "";

    if (categorias.length === 0) {
        tablaCategorias.innerHTML = `<tr><td colspan="3" style="text-align: center;">No se encontraron categorías.</td></tr>`;
        return;
    }

    categorias.forEach(cat => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.nombre}</td>
            <td>
                <button class="btn-editar" data-id="${cat.id}" data-nombre="${cat.nombre}">✏️ Editar</button>
                <button class="btn-eliminar" data-id="${cat.id}">🗑️ Eliminar</button>
            </td>
        `;

        tablaCategorias.appendChild(fila);
    });

    // Eventos para botones Editar
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            const nombre = e.target.getAttribute("data-nombre");
            prepararEdicion(id, nombre);
        });
    });

    // Eventos para botones Eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-id");
            eliminarCategoria(id);
        });
    });
}

// 3. Buscador en tiempo real
if (buscarInput) {
    buscarInput.addEventListener("input", (e) => {
        const busqueda = e.target.value.toLowerCase().trim();
        const filtradas = listaCategorias.filter(cat =>
            cat.nombre.toLowerCase().includes(busqueda)
        );
        renderizarTabla(filtradas);
    });
}

// 4. Guardar (Crear o Actualizar)
if (formCategoria) {
    formCategoria.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const id = inputId.value;

        if (!nombre) return;

        if (id) {
            // ACTUALIZAR CATEGORÍA
            const { error } = await supabase
                .from("Categorias")
                .update({ nombre: nombre })
                .eq("id", id);

            if (error) {
                alert("Error al actualizar la categoría: " + error.message);
            } else {
                alert("¡Categoría actualizada con éxito!");
                limpiarFormulario();
                await cargarCategorias();
            }
        } else {
            // CREAR NUEVA CATEGORÍA
            const { error } = await supabase
                .from("Categorias")
                .insert([{ nombre: nombre }]);

            if (error) {
                alert("Error al crear la categoría: " + error.message);
            } else {
                alert("¡Categoría creada con éxito!");
                limpiarFormulario();
                await cargarCategorias();
            }
        }
    });
}

// 5. Cargar datos en el formulario para editar
function prepararEdicion(id, nombre) {
    inputId.value = id;
    inputNombre.value = nombre;
    tituloForm.textContent = "Editar Categoría";
    btnGuardar.textContent = "Actualizar Categoría";
    btnCancelar.style.display = "inline-block";
}

// 6. Cancelar Edición
if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        limpiarFormulario();
    });
}

function limpiarFormulario() {
    inputId.value = "";
    inputNombre.value = "";
    tituloForm.textContent = "Crear Nueva Categoría";
    btnGuardar.textContent = "Guardar Categoría";
    btnCancelar.style.display = "none";
}

// 7. Eliminar Categoría
async function eliminarCategoria(id) {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    const { error } = await supabase
        .from("Categorias")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Error al eliminar (asegúrate de que no tenga productos asociados): " + error.message);
    } else {
        alert("Categoría eliminada.");
        await cargarCategorias();
    }
}