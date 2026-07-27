/* JavaScript Modificado */
function toggleBuscador() {
  let dropdown = document.getElementById('dropdownBuscador');
  if (dropdown.style.display === 'block') {
    dropdown.style.display = 'none';
  } else {
    dropdown.style.display = 'block';
    document.getElementById('buscadorProductos').focus();
  }
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