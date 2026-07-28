import { supabase } from "./config.js";

const formEditar = document.getElementById("form-editar-producto");
const editId = document.getElementById("edit-id");
const editNombre = document.getElementById("edit-nombre");
const editPrecio = document.getElementById("edit-precio");
const editStock = document.getElementById("edit-stock");
const editDescripcion = document.getElementById("edit-descripcion");

const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get("id");

document.addEventListener("DOMContentLoaded", async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    window.location.href = "login.html";
    return;
  }

  if (productoId) {
    await cargarDatosProducto(productoId);
  } else {
    alert("No se especificó un ID de producto válido.");
    window.location.href = "productos.html";
  }
});

async function cargarDatosProducto(id) {
  const { data: producto, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Error al cargar producto: " + error.message);
    return;
  }

  if (producto) {
    if (editId) editId.value = producto.id;
    if (editNombre) editNombre.value = producto.nombre || "";
    if (editPrecio) editPrecio.value = producto.precio || 0;
    if (editStock) editStock.value = producto.cantidad || 0;
  }
}

if (formEditar) {
  formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = editId.value;
    const datosActualizados = {
      nombre: editNombre.value.trim(),
      precio: parseFloat(editPrecio.value),
      cantidad: parseInt(editStock.value, 10),
      descripcion: editDescripcion ? editDescripcion.value.trim() : ""
    };

    const { error } = await supabase
      .from("productos")
      .update(datosActualizados)
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      alert("¡Producto actualizado con éxito!");
      window.location.href = "productos.html";
    }
  });
}