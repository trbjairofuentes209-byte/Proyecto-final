import { supabase } from './config.js';

const formCrearCat = document.getElementById('form-crear-categoria');
const tablaCategorias = document.getElementById('tablaCategorias');

// Cargar y listar las categorías existentes al abrir la página
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasTabla();
});

async function cargarCategoriasTabla() {
    if (!tablaCategorias) return;

    const { data: categorias, error } = await supabase
        .from('Categorias')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error al cargar categorías:', error.message);
        return;
    }

    tablaCategorias.innerHTML = '';

    categorias.forEach(cat => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.nombre}</td>
        `;
        tablaCategorias.appendChild(fila);
    });
}

// Guardar nueva categoría desde el formulario web
if (formCrearCat) {
    formCrearCat.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombreCategoria = document.getElementById('nombre-categoria').value.trim();

        const { error } = await supabase
            .from('Categorias')
            .insert([{ nombre: nombreCategoria }]);

        if (error) {
            alert('Error al crear la categoría: ' + error.message);
            console.error(error);
        } else {
            alert('¡Categoría creada con éxito!');
            formCrearCat.reset();
            cargarCategoriasTabla(); // Refresca la tabla automáticamente
        }
    });
}
function filtrarProductos() {
  // Obtener el valor del input y pasarlo a minúsculas para que no distinga mayúsculas/minúsculas
  let input = document.getElementById('buscadorProductos');
  let filtro = input.value.toLowerCase();
  
  // Obtener la tabla y las filas de los productos
  let tabla = document.getElementById('tablaProductos'); // Asegúrate de darle este ID a tu <table>
  let filas = tabla.getElementsByTagName('tr');

  // Recorrer todas las filas (omitiendo la cabecera)
  for (let i = 1; i < filas.length; i++) {
    let celdaNombre = filas[i].getElementsByTagName('td')[0]; // Columna Nombre
    let celdaCategoria = filas[i].getElementsByTagName('td')[1]; // Columna Categoría
    
    if (celdaNombre || celdaCategoria) {
      let textoNombre = celdaNombre.textContent || celdaNombre.innerText;
      let textoCategoria = celdaCategoria.textContent || celdaCategoria.innerText;

      // Verificar si el texto coincide con el nombre o la categoría
      if (textoNombre.toLowerCase().indexOf(filtro) > -1 || textoCategoria.toLowerCase().indexOf(filtro) > -1) {
        filas[i].style.display = ""; // Mostrar fila
      } else {
        filas[i].style.display = "none"; // Ocultar fila
      }
    }
  }
}