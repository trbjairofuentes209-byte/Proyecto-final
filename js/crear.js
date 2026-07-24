import { supabase } from './config.js';

const formCrear = document.getElementById('form-crear-producto');

if (formCrear) {
  formCrear.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Estructura adaptada exactamente a las columnas de tu tabla en Supabase
    const nuevoProducto = {
      nombre: document.getElementById('nombre').value.trim(),
      categoria: document.getElementById('categoria').value.trim(),
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