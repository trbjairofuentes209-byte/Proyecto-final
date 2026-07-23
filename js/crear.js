import { supabase } from './config.js';

const formCrear = document.getElementById('form-crear-producto');
const selectCategoria = document.getElementById('categoria');

// Cargar las categorías en el <select> al iniciar la página
async function cargarCategoriasSelect() {
    if (!selectCategoria) return;

    const { data: categorias, error } = await supabase
        .from('Categorias')
        .select('*');

    if (error) {
        console.eror('Error al cargar categorías:', error.message);
        selectCategoria.innerHTML = '<option value="">Error al cargar categorías</option>';
        return;
    }

    selectCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';

    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id; // Guarda el ID numérico para la llave foránea de la base de datos
        option.textContent = cat.nombre; // Muestra el nombre de la categoría
        selectCategoria.appendChild(option);
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasSelect();
});

if (formCrear) {
  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Estructura adaptada exactamente a las columnas de tu tabla en Supabase
    const nuevoProducto = {
      nombre: document.getElementById('nombre').value.trim(),
      Categorias_id: parseInt(document.getElementById('categoria').value, 10), // Envía el ID seleccionado
      cantidad: parseInt(document.getElementById('cantidad').value, 10),
      precio: parseFloat(document.getElementById('precio').value)
    };

    // Petición a Supabase
    const { error } = await supabase
      .from('productos')
      .insert([nuevoProducto]);

    if (error) {
      alert('Error al guardar en Supabase: ' + error.message);
      console.error(error);
    } else {
      alert('¡Producto creado con éxito!');
      window.location.href = 'productos.html';
    }
  });
}