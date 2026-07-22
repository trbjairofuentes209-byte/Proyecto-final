// Base de datos inicial (en caso de que LocalStorage esté vacío)
const productosPredefinidos = [
    { id: "1", name: "Peluche Totoro Grande", category: "Peluches", price: 25.99, stock: 13, status: "Destacado", img: "IMG/totoro.jpg" },
    { id: "2", name: "Peluche Pikachu Jumbo", category: "Peluches", price: 32.50, stock: 20, status: "Destacado", img: "IMG/pikachu.jpg" },
    { id: "3", name: "Pulseras Naruto Chakra", category: "Pulseras", price: 8.99, stock: 50, status: "Estándar", img: "IMG/naruto-pulsera.jpg" },
    { id: "4", name: "Set Pulseras Demon Slayer", category: "Pulseras", price: 14.99, stock: 30, status: "Destacado", img: "IMG/demon-pulsera.jpg" },
    { id: "5", name: "Llavero Akatsuki", category: "Llaveros", price: 6.50, stock: 40, status: "Estándar", img: "IMG/llavero.jpg" },
    { id: "6", name: "Figura Goku Super Saiyan", category: "Figuras", price: 45.00, stock: 8, status: "Estándar", img: "IMG/goku.jpg" }
];

// Cargar productos de LocalStorage o inicializar con los de arriba
let productos = JSON.parse(localStorage.getItem('hiblook_productos')) || productosPredefinidos;
if(!localStorage.getItem('hiblook_productos')) {
    localStorage.setItem('hiblook_productos', JSON.stringify(productos));
}

// Elementos de la interfaz
const tableBody = document.getElementById('inventory-table-body');
const searchInput = document.getElementById('admin-search');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const modalTitle = document.getElementById('modal-title');

// Renderizar la tabla completa
function renderTable(filterText = "") {
    tableBody.innerHTML = "";
    
    const filtered = productos.filter(p => 
        p.name.toLowerCase().includes(filterText.toLowerCase()) || 
        p.category.toLowerCase().includes(filterText.toLowerCase())
    );

    filtered.forEach(p => {
        // Formato visual para etiquetas de stock
        let stockClass = "high";
        if (p.stock <= 10) stockClass = "low";
        else if (p.stock <= 25) stockClass = "medium";

        // Formato visual para etiquetas de estado
        let statusClass = p.status === "Destacado" ? "destacado" : "";

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-cell">
                    <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/40x40?text=Item'">
                    <span>${p.name}</span>
                </div>
            </td>
            <td>${p.category}</td>
            <strong style="display:table-cell; padding-top:16px;">$${parseFloat(p.price).toFixed(2)}</strong>
            <td><span class="badge-stock ${stockClass}">${p.stock}</span></td>
            <td><span class="badge-status ${statusClass}">${p.status}</span></td>
            <td>
                <div class="actions-cell">
                    <button class="action-btn edit" onclick="openEditModal('${p.id}')" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete" onclick="deleteProduct('${p.id}')" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Escuchador del buscador en tiempo real
searchInput.addEventListener('input', (e) => renderTable(e.target.value));

// Operación: Abrir para Crear Nuevo
document.getElementById('open-create-modal').addEventListener('click', () => {
    modalTitle.textContent = "Nuevo Producto";
    productForm.reset();
    document.getElementById('product-id').value = ""; // Vacío significa creación
    productModal.style.display = "flex";
});

// Operación: Abrir para Editar existente
window.openEditModal = function(id) {
    const p = productos.find(prod => prod.id === id);
    if (!p) return;

    modalTitle.textContent = "Editar Producto";
    document.getElementById('product-id').value = p.id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-category').value = p.category;
    document.getElementById('prod-status').value = p.status;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('prod-img').value = p.img;

    productModal.style.display = "flex";
};

// Cerrar Modal
function closeModal() { productModal.style.display = "none"; }
document.getElementById('close-modal-btn').addEventListener('click', closeModal);
document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);

// Guardar cambios (Formulario Submit: Crea o Edita)
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('prod-name').value;
    const category = document.getElementById('prod-category').value;
    const status = document.getElementById('prod-status').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const stock = parseInt(document.getElementById('prod-stock').value);
    const img = document.getElementById('prod-img').value;

    if (id) {
        // MODO EDITAR
        productos = productos.map(p => p.id === id ? { id, name, category, price, stock, status, img } : p);
    } else {
        // MODO CREAR NUEVO
        const nuevoProducto = {
            id: Date.now().toString(), // ID único basado en tiempo
            name, category, price, stock, status, img
        };
        productos.push(nuevoProducto);
    }

    localStorage.setItem('hiblook_productos', JSON.stringify(productos));
    renderTable();
    closeModal();
});

// Operación: Eliminar Producto
window.deleteProduct = function(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto del inventario?")) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('hiblook_productos', JSON.stringify(productos));
        renderTable();
    }
};

// Carga Inicial
renderTable();