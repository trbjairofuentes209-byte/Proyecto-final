import { supabase } from './config.js';

// Referencia al tbody del HTML
const tablaProductos = document.getElementById('tablaProductos');

// 1. Cargar productos en cuanto la página esté lista
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});

// 2. Función principal para consultar Supabase y pintar la tabla
export async function cargarProductos() {
  if (!tablaProductos) return;

  // Consulta a la tabla 'productos' en Supabase
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: false }); // Muestra primero los más recientes

  if (error) {
    console.error('Error al cargar productos:', error.message);
    return;
  }

  // Limpiar la tabla antes de insertar
  tablaProductos.innerHTML = '';

  // Renderizar las filas dinámicamente
  productos.forEach(p => {
    const fila = document.createElement('tr');
    
    fila.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>${p.cantidad}</td>
      <td>$${Number(p.precio).toFixed(2)}</td>
      <td>
        <button class="btn-editar" data-id="${p.id}">Editar</button>
        <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    `;

    tablaProductos.appendChild(fila);
  });

  // Asignar eventos de eliminación a los botones recién creados
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarProducto(id);
    });
  });

  // Asignar eventos para redirigir a editar
  document.querySelectorAll('.btn-editar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      window.location.href = `editar.html?id=${id}`;
    });
  });
}

// 3. Función para eliminar un producto
async function eliminarProducto(id) {
  if (!confirm('¿Deseas eliminar este producto?')) return;

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error al eliminar: ' + error.message);
  } else {
    // Vuelve a consultar Supabase para refrescar la tabla de inmediato
    cargarProductos();
  }
}
import { supabase } from './config.js';
import { cargarProductos } from './productos.js';

// Dentro de tu evento de Submit para crear el producto:
const { error } = await supabase
  .from('productos')
  .insert([nuevoProducto]);

if (error) {
  alert('Error al guardar: ' + error.message);
} else {
  alert('¡Producto creado con éxito!');
  formProducto.reset();
  modal.classList.remove('activo'); // Cierra el modal
  
  cargarProductos(); // <--- ESTO actualiza la tabla al instante
}