// ===== CART MANAGEMENT =====

const CART_KEY = 'nexus_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

async function addToCart(productId) {
  const products = await fetchProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
  showToast(`✓ ${product.name} added to cart!`);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartSummaryEl = document.getElementById('cartSummary');
  if (!cartItemsEl) return;

  const cart = getCart();

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-bag"></i>
        <h3>Your cart is empty</h3>
        <a href="../index.html" class="btn-primary">Continue Shopping</a>
      </div>
    `;
    if (cartSummaryEl) cartSummaryEl.style.display = 'none';
    return;
  }

  if (cartSummaryEl) cartSummaryEl.style.display = 'block';

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}"/>
      <div class="cart-item-info">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">$${item.price}</p>
      </div>
      <div class="cart-qty">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cartSummaryEl) {
    cartSummaryEl.querySelector('#subtotal').textContent = `$${subtotal.toFixed(2)}`;
    cartSummaryEl.querySelector('#shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    cartSummaryEl.querySelector('#total').textContent = `$${total.toFixed(2)}`;
  }
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
  showToast('🎉 Order placed successfully! Thank you!');
  setTimeout(() => { renderCart(); }, 500);
}
