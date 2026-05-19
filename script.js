// Product Data
const products = [
    {
        id: 2,
        name: "Sneakers",
        price: 129.50,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 249.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
    },

    {
        id: 5,
        name: "Cherry Blossom Perfume",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Sunglasses",
        price: 159.00,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 7,
        name: "Earbuds",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop"
    },

    {
        id: 9,
        name: "Magenta Lipstick",
        price: 24.50,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop"
    },

    {
        id: 11,
        name: "Quilted Crossbody Bag",
        price: 450.00,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 12,
        name: "Blue Sapphire Pendant",
        price: 890.00,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 13,
        name: "Sling bag",
        price: 320.00,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: 14,
        name: "Pearl & Rose Gold Choker",
        price: 650.00,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop"
    }
];

// State
let cart = [];
let wishlist = [];
let searchQuery = '';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search-input');
const cartIcon = document.getElementById('cart-icon');
const wishlistIcon = document.getElementById('wishlist-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const closeCart = document.getElementById('close-cart');
const closeWishlist = document.getElementById('close-wishlist');
const overlay = document.getElementById('overlay');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartItemsContainer = document.getElementById('cart-items');
const wishlistItemsContainer = document.getElementById('wishlist-items');
const cartTotal = document.getElementById('cart-total');
const toast = document.getElementById('toast');

// Initialize
function init() {
    renderProducts();
    setupEventListeners();
}

// Render Products
function renderProducts() {
    productGrid.innerHTML = '';
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery));

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--text-light);">No products found matching your search.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const isWishlisted = wishlist.some(item => item.id === product.id);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${product.id}, event)">
                    <i class="fa-${isWishlisted ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="card-actions">
                    <button class="btn btn-outline" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn btn-primary" onclick="buyNow(${product.id})">Buy Now</button>
                </div>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Event Listeners
function setupEventListeners() {
    cartIcon.addEventListener('click', () => openSidebar(cartSidebar));
    wishlistIcon.addEventListener('click', () => openSidebar(wishlistSidebar));

    closeCart.addEventListener('click', () => closeSidebars());
    closeWishlist.addEventListener('click', () => closeSidebars());
    overlay.addEventListener('click', () => closeSidebars());

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderProducts();
        });
    }
}

// Sidebar logic
function openSidebar(sidebar) {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeSidebars() {
    cartSidebar.classList.remove('open');
    wishlistSidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Actions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    showToast(`${product.name} added to cart!`);
}

function toggleWishlist(productId, event) {
    const product = products.find(p => p.id === productId);
    const index = wishlist.findIndex(item => item.id === productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showToast(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showToast(`${product.name} added to wishlist!`);
    }

    // Update button visual directly for better UX
    const btn = event.currentTarget;
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    }

    updateWishlist();
}

function buyNow(productId) {
    addToCart(productId);
    openSidebar(cartSidebar);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function removeFromWishlist(id) {
    const index = wishlist.findIndex(item => item.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        updateWishlist();
        renderProducts(); // Need to re-render to update the heart icons
    }
}

function moveToCart(id) {
    addToCart(id);
    removeFromWishlist(id);
}

// Updates
function updateCart() {
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="sidebar-item-info">
                <div class="sidebar-item-title">${item.name}</div>
                <div class="sidebar-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function updateWishlist() {
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p class="empty-msg">Your wishlist is empty</p>';
        return;
    }

    wishlistItemsContainer.innerHTML = '';

    wishlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'sidebar-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="sidebar-item-info">
                <div class="sidebar-item-title">${item.name}</div>
                <div class="sidebar-item-price">$${item.price.toFixed(2)}</div>
                <button class="btn btn-outline" style="font-size: 0.8rem; padding: 0.3rem 0.6rem; margin-top: 0.5rem;" onclick="moveToCart(${item.id})">Move to Cart</button>
            </div>
            <button class="remove-btn" onclick="removeFromWishlist(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        wishlistItemsContainer.appendChild(div);
    });
}

function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }
    showToast("Processing order... Thank you!");
    cart = [];
    updateCart();
    setTimeout(closeSidebars, 1500);
}

// Toast
let toastTimeout;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Start
init();
updateCart();
updateWishlist();
