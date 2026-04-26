// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== SEARCH =====
function toggleSearch() {
  const bar = document.getElementById('searchBar');
  if (bar) {
    bar.classList.toggle('open');
    if (bar.classList.contains('open')) document.getElementById('searchInput').focus();
  }
}

function handleSearch(e) {
  if (e.key === 'Enter') {
    const q = document.getElementById('searchInput').value.trim();
    if (q) window.location.href = `pages/products.html?search=${encodeURIComponent(q)}`;
  }
}

// ===== LOAD PRODUCTS FROM JSON =====
async function fetchProducts() {
  // Determine path based on current location
  const base = window.location.pathname.includes('/pages/') ? '../' : '';
  const res = await fetch(base + 'data/products.json');
  return await res.json();
}

// ===== RENDER PRODUCT CARD =====
function renderProductCard(p) {
  const badgeClass = p.badge ? (p.badge === 'Sale' ? 'badge sale' : p.badge === 'New' ? 'badge new' : p.badge === 'Limited' ? 'badge limited' : 'badge') : '';
  const oldPriceHtml = p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : '';
  const stars = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
  const base = window.location.pathname.includes('/pages/') ? '' : 'pages/';

  return `
    <div class="product-card" onclick="location.href='${base}product.html?id=${p.id}'">
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy"/>
        ${p.badge ? `<span class="${badgeClass}">${p.badge}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn" title="Quick View" onclick="event.stopPropagation(); location.href='${base}product.html?id=${p.id}'">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn" title="Add to Cart" onclick="event.stopPropagation(); addToCart(${p.id})">
            <i class="fas fa-shopping-bag"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-num">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price">$${p.price}</span>
          ${oldPriceHtml}
        </div>
        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">
          <i class="fas fa-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

// ===== LOAD FEATURED =====
async function loadFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const products = await fetchProducts();
  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map(renderProductCard).join('');
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== UPDATE CART COUNT IN NAVBAR =====
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartCount');
  if (!badge) return;
  badge.textContent = total;
  badge.classList.toggle('show', total > 0);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);
