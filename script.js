const products = {
    'promo-carne-wraps-bondiola': { name: 'PROMO: 2 Wraps de Carne + 1 Wrap de Bondiola', price: 21800, isPromo: true },
    'promo-pollo-wraps-bondiola': { name: 'PROMO: 2 Wraps de Pollo + 1 Wrap de Bondiola', price: 21800, isPromo: true },
    'promo-pollo-wraps-verdura': { name: 'PROMO: 2 Wraps de Pollo + 1 Wrap de Verdura', price: 20750, isPromo: true },
    'promo-carne-wraps-verdura': { name: 'PROMO: 2 Wraps de Carne + 1 Wrap de Verdura', price: 20750, isPromo: true },
    'sorrentinos-osobuco': { name: 'Sorrentinos de Osobuco', price: 13500 },
    'sorrentinos-calabaza': { name: 'Sorrentinos de Calabaza', price: 10000 },
    'wraps-pollo': { name: 'Wraps de Pollo x2', price: 15500 },
    'wraps-carne': { name: 'Wraps de Carne x2', price: 15500 },
    'wraps-bondiola': { name: 'Wraps Bondiola x2', price: 15500 },
    'wraps-verdura': { name: 'Wraps Verdura x2', price: 13500 },
    'wraps-mixtos': { name: 'Wraps Mixtos x2', price: 15500 },
    'wrap-carne-unidad': { name: 'Wrap de Carne (Unidad)', price: 9000 },
    'wrap-pollo-unidad': { name: 'Wrap de Pollo (Unidad)', price: 9000 },
    'wrap-bondiola-unidad': { name: 'Wrap de Bondiola (Unidad)', price: 9000 },
    'wrap-verdura-unidad': { name: 'Wrap de Verdura (Unidad)', price: 7500 },
    'salsa-500ml': { name: 'Salsa Casera 500ml', price: 3500 },
    'salsa-250ml': { name: 'Salsa Casera 250ml', price: 1750 }
};

let cart = {};
let quantities = {};
let appliedDiscount = null;

const validDiscountCodes = {
    'PATERGYM': { name: 'PATERGYM', discount: 0.10 },
    '40MINUTOS': { name: '40MINUTOS', discount: 0.10 }
};

function updateQuantity(productId, change) {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    quantities[productId] = newQty;
    
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    qtyDisplay.textContent = newQty;
    qtyDisplay.classList.add('pulse');
    setTimeout(() => qtyDisplay.classList.remove('pulse'), 300);
}

function addToCart(productId) {
    const qty = quantities[productId] || 0;
    if (qty === 0) return;

    cart[productId] = (cart[productId] || 0) + qty;
    quantities[productId] = 0;
    document.getElementById(`qty-${productId}`).textContent = '0';

    const card = document.querySelector(`[data-id="${productId}"]`);
    card.classList.add('selected');
    setTimeout(() => card.classList.remove('selected'), 300);

    updateCartDisplay();
}

function removeFromCart(productId) {
    delete cart[productId];
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartCount');
    
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    cartCount.textContent = `(${totalItems})`;

    if (totalItems === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartFooter.style.display = 'none';
        return;
    }

    cartFooter.style.display = 'block';
    cartItems.innerHTML = Object.entries(cart).map(([id, qty]) => {
        const product = products[id];
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${product.name}</div>
                    <div class="cart-item-price">
                        $${product.price.toLocaleString('es-AR')} 
                        <span class="cart-item-quantity">x${qty}</span>
                    </div>
                </div>
                <button class="btn-quantity" onclick="removeFromCart('${id}')"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join('');

    updateTotal();
}

function updateTotal() {
    let subtotal = 0;
    let discountableAmount = 0;
    
    
    for (const [id, qty] of Object.entries(cart)) {
        const product = products[id];
        const itemTotal = product.price * qty;
        subtotal += itemTotal;
        
        
        if (!product.isPromo) {
            discountableAmount += itemTotal;
        }
    }

    
    if (document.getElementById('delivery').checked) {
        subtotal += 1000;
    }

    
    let discountAmount = 0;
    if (appliedDiscount && discountableAmount > 0) {
        discountAmount = Math.round(discountableAmount * appliedDiscount.discount);
    }

    
    const total = subtotal - discountAmount;

    
    const showBreakdown = appliedDiscount !== null;
    
    document.getElementById('cartSubtotal').style.display = showBreakdown ? 'flex' : 'none';
    document.getElementById('cartDiscount').style.display = showBreakdown ? 'flex' : 'none';
    
    if (showBreakdown) {
        document.getElementById('cartSubtotalAmount').textContent = `$${subtotal.toLocaleString('es-AR')}`;
        document.getElementById('cartDiscountAmount').textContent = `-$${discountAmount.toLocaleString('es-AR')}`;
    }
    
    document.getElementById('cartTotal').textContent = `$${total.toLocaleString('es-AR')}`;
}

function applyDiscount() {
    const input = document.getElementById('discountCode');
    const code = input.value.trim().toUpperCase();
    const messageEl = document.getElementById('discountMessage');
    
    if (!code) {
        messageEl.className = 'discount-message error';
        messageEl.textContent = 'Por favor ingresá un código';
        return;
    }
    
    if (validDiscountCodes[code]) {
        appliedDiscount = validDiscountCodes[code];
        
        
        document.getElementById('appliedCodeName').textContent = appliedDiscount.name;
        document.getElementById('discountAppliedBadge').style.display = 'flex';
        document.getElementById('discountInputGroup').style.display = 'none';
        
        messageEl.className = 'discount-message success';
        messageEl.textContent = '¡Código aplicado! 10% de descuento en productos regulares';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
        
        input.value = '';
        updateTotal();
    } else {
        messageEl.className = 'discount-message error';
        messageEl.textContent = 'Código inválido.';
    }
}

function removeDiscount() {
    appliedDiscount = null;
    document.getElementById('discountAppliedBadge').style.display = 'none';
    document.getElementById('discountInputGroup').style.display = 'flex';
    document.getElementById('discountMessage').style.display = 'none';
    document.getElementById('discountCode').value = '';
    updateTotal();
}

function toggleCart() {
    const cart = document.getElementById('cartSummary');
    cart.classList.toggle('collapsed');
}

function sendWhatsApp() {
    let message = '*PEDIDO*\n\n';
    
    let subtotal = 0;
    let discountableAmount = 0;
    
    for (const [id, qty] of Object.entries(cart)) {
        const product = products[id];
        const itemTotal = product.price * qty;
        subtotal += itemTotal;
        
        if (!product.isPromo) {
            discountableAmount += itemTotal;
        }
        
        message += `• ${product.name} x${qty}\n`;
    }

    if (document.getElementById('delivery').checked) {
        message += '\nCon envío a domicilio (+$1.000)\n';
        subtotal += 1000;
    }

    let discountAmount = 0;
    if (appliedDiscount && discountableAmount > 0) {
        discountAmount = Math.round(discountableAmount * appliedDiscount.discount);
        message += `\nDescuento ${appliedDiscount.name} (10%): -$${discountAmount.toLocaleString('es-AR')}\n`;
    }

    const total = subtotal - discountAmount;
    
    message += `\n*Total: $${total.toLocaleString('es-AR')}*`;

    const whatsappUrl = `https://wa.me/542323354483?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}