// === SECCIÓN 1: CONTROL DEL MENÚ RESPONSIVO (HAMBURGUESA) ===
const menuToggle = document.getElementById('menu-toggle');
const menuNavegacion = document.querySelector('.menu-navegacion');
const menuIcon = document.querySelector('.menu-icon');

if (menuToggle && menuNavegacion && menuIcon) {
    menuIcon.addEventListener('click', (event) => {
        event.preventDefault();
        const isOpen = menuNavegacion.classList.toggle('active');
        menuToggle.checked = isOpen;
        menuIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.menu-navegacion a').forEach(link => {
        link.addEventListener('click', () => {
            menuNavegacion.classList.remove('active');
            menuToggle.checked = false;
            menuIcon.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            menuNavegacion.classList.remove('active');
            menuToggle.checked = false;
            menuIcon.setAttribute('aria-expanded', 'false');
        }
    });
}

// === SECCIÓN 2: LÓGICA COMPLETA DEL CARRITO DE COMPRAS ===

// Estado del carrito (Carga los datos guardados en el navegador o inicia vacío)
let cart = JSON.parse(localStorage.getItem('hiblook_cart')) || [];

// Elementos de la interfaz del Carrito
const cartOverlay = document.getElementById('cart-overlay');
const openCartBtn = document.getElementById('open-cart');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountElement = document.getElementById('cart-count');
const modalCartCountElement = document.getElementById('modal-cart-count');
const summaryItemsCountElement = document.getElementById('summary-items-count');
const summarySubtotalElement = document.getElementById('summary-subtotal');
const summaryTotalElement = document.getElementById('summary-total');
const clearCartBtn = document.getElementById('clear-cart-btn');
const sendWhatsappBtn = document.getElementById('send-whatsapp-btn');

// Abrir y cerrar el modal
if (openCartBtn) openCartBtn.addEventListener('click', () => cartOverlay.style.display = 'flex');
if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartOverlay.style.display = 'none');

if (cartOverlay) {
    window.addEventListener('click', (e) => {
        if (e.target === cartOverlay) cartOverlay.style.display = 'none';
    });
}

// Escuchar clics en los botones "Agregar al carrito" de los productos
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.producto-card');
        const id = card.getAttribute('data-id');
        const name = card.getAttribute('data-name');
        const price = parseFloat(card.getAttribute('data-price'));
        const image = card.querySelector('.article-img img').getAttribute('src');

        addToCart(id, name, price, image);
    });
});

// Agregar un producto al estado del carrito
function addToCart(id, name, price, image) {
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }

    updateCart();
}

// Cambiar cantidades (+ / -) dentro del modal
function changeQuantity(id, amount) {
    const product = cart.find(item => item.id === id);
    if (!product) return;

    product.quantity += amount;

    if (product.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}

// Eliminar un artículo completo
function deleteItem(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Vaciar carrito
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
}

// Renderizar cambios e importes totales en pantalla
function updateCart() {
    // Guardar en la persistencia local
    localStorage.setItem('hiblook_cart', JSON.stringify(cart));

    // Calcular cantidades y precio total acumulado
    let totalItems = 0;
    let subtotal = 0;

    if (cartItemsContainer) cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        totalItems += item.quantity;
        subtotal += item.price * item.quantity;

        // Crear la estructura HTML del elemento en el carrito
        if (cartItemsContainer) {
            const itemHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Categoría</p>
                        <div class="cart-qty-controls">
                            <button onclick="changeQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="changeQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price-delete">
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="delete-item-btn" onclick="deleteItem('${item.id}')">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        }
    });

    // Actualizar badges e indicadores de precios del DOM
    if (cartCountElement) cartCountElement.innerText = totalItems;
    if (modalCartCountElement) modalCartCountElement.innerText = totalItems;
    if (summaryItemsCountElement) summaryItemsCountElement.innerText = totalItems;
    
    const formattedPrice = `$${subtotal.toFixed(2)}`;
    if (summarySubtotalElement) summarySubtotalElement.innerText = formattedPrice;
    if (summaryTotalElement) summaryTotalElement.innerText = formattedPrice;
}

// === ENVÍO PROCESADO POR WHATSAPP ===
if (sendWhatsappBtn) {
    sendWhatsappBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de realizar tu orden.");
            return;
        }

        // Número de teléfono de tu marca (Reemplaza con el tuyo incluyendo código de país)
        const numeroTelefono = "50376543210"; 

        // Construir plantilla limpia del mensaje
        let mensaje = `*¡Hola Hiblook! 👋*\n*Me gustaría realizar el siguiente pedido:*\n\n`;
        
        let totalPedido = 0;
        cart.forEach((item, index) => {
            const totalItem = item.price * item.quantity;
            totalPedido += totalItem;
            mensaje += `${index + 1}. *${item.name}* (x${item.quantity}) - _$${totalItem.toFixed(2)}_\n`;
        });

        mensaje += `\n-------------------------------\n`;
        mensaje += `💰 *Total Estimado:* $${totalPedido.toFixed(2)}\n`;
        mensaje += `📦 *Envío:* A coordinar con el agente.`;

        // Codificar texto para formato URL estándar
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
        
        // Redirigir abriendo en pestaña nueva externa
        window.open(urlWhatsApp, '_blank');
    });
}

// Inicializar el render del carrito en carga de página
document.addEventListener('DOMContentLoaded', updateCart);