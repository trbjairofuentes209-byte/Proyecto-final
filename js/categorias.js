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