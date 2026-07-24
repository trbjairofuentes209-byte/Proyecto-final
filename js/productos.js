import { supabase } from './config.js';

// Referencia al contenedor de la tabla
const tablaProductos = document.getElementById('tablaProductos');

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});

// Obtener registros de Supabase con JOIN a Categorias
export async function cargarProductos() {
  if (!tablaProductos) return;

  // Realizamos una consulta relacionando la tabla de Categorias
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*, Categorias(nombre)')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error al cargar productos:', error.message);
    return;
  }

  // Limpiar contenido previo
  tablaProductos.innerHTML = '';

  // Renderizar cada fila
  productos.forEach(p => {
    const fila = document.createElement('tr');
    
    // Si p.Categorias existe trae p.Categorias.nombre, sino muestra 'Sin categoría'
    const nombreCategoria = p.Categorias ? p.Categorias.nombre : 'Sin categoría';

    fila.innerHTML = `
      <td>${p.nombre || ''}</td>
      <td>${nombreCategoria}</td>
      <td>${p.cantidad ?? 0}</td>
      <td>$${Number(p.precio || 0).toFixed(2)}</td>
      <td>
        <button class="btn-editar" data-id="${p.id}">Editar</button>
        <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
      </td>
    `;

    tablaProductos.appendChild(fila);
  });

  // Asignar listeners a los botones de Eliminar
  document.querySelectorAll('.btn-eliminar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      eliminarProducto(id);
    });
  });

  // Asignar listeners a los botones de Editar
  document.querySelectorAll('.btn-editar').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      window.location.href = `editar.html?id=${id}`;
    });
  });
}

// Función para eliminar un producto por ID
async function eliminarProducto(id) {
  if (!confirm('¿Deseas eliminar este producto?')) return;

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Error al eliminar: ' + error.message);
  } else {
    cargarProductos(); // Refresca la tabla tras eliminar
  }
}