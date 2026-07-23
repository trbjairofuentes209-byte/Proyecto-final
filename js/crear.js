import { supabase } from './config.js';

const formCrear = document.getElementById('form-crear-producto');

if (formCrear) {
  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoProducto = {
      nombre: document.getElementById('nombre').value,
      precio: parseFloat(document.getElementById('precio').value),
      stock: parseInt(document.getElementById('stock').value),
      descripcion: document.getElementById('descripcion').value
    };

    const { error } = await supabase
      .from('productos')
      .insert([nuevoProducto]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Producto creado con éxito!');
      window.location.href = 'productos.html';
    }
  });
}
