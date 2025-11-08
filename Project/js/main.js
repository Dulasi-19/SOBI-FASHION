// Initialize products if not exists
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        const defaultProducts = [
            {
                id: 1,
                name: 'Elegant Cotton Saree',
                category: 'Cotton Saree',
                price: 2500,
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
            },
            {
                id: 2,
                name: 'Designer Poonam Saree',
                category: 'Poonam Saree',
                price: 3500,
                image: 'https://images.unsplash.com/photo-1617137968427-85924c5a5c82?w=600&h=600&fit=crop'
            },
            {
                id: 3,
                name: 'Traditional Kanchipuram',
                category: 'Kanchipuram Saree',
                price: 8000,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d3f195?w=600&h=600&fit=crop'
            },
            {
                id: 4,
                name: 'Luxury Banarasi Saree',
                category: 'Banarasi Saree',
                price: 12000,
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
            },
            {
                id: 5,
                name: 'Royal Paithani Saree',
                category: 'Paithani Saree',
                price: 15000,
                image: 'https://images.unsplash.com/photo-1617137968427-85924c5a5c82?w=600&h=600&fit=crop'
            },
            {
                id: 6,
                name: 'Comfortable Nighty',
                category: 'Nighty',
                price: 800,
                image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop'
            },
            {
                id: 7,
                name: 'Beautiful Silk Cotton Saree',
                category: 'Cotton Saree',
                price: 2800,
                image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 8,
                name: 'Elegant Designer Poonam',
                category: 'Poonam Saree',
                price: 4200,
                image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 9,
                name: 'Premium Kanchipuram Silk',
                category: 'Kanchipuram Saree',
                price: 9500,
                image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 10,
                name: 'Exquisite Banarasi Silk',
                category: 'Banarasi Saree',
                price: 13500,
                image: 'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 11,
                name: 'Classic Paithani Silk',
                category: 'Paithani Saree',
                price: 16500,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d3f195?w=600&h=600&fit=crop'
            },
            {
                id: 12,
                name: 'Stylish Nighty Set',
                category: 'Nighty',
                price: 950,
                image: 'https://images.pexels.com/photos/1598504/pexels-photo-1598504.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 13,
                name: 'Premium Elegant Cotton',
                category: 'Cotton Saree',
                price: 3200,
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop'
            },
            {
                id: 14,
                name: 'Exclusive Designer Poonam',
                category: 'Poonam Saree',
                price: 4800,
                image: 'https://images.unsplash.com/photo-1617137968427-85924c5a5c82?w=600&h=600&fit=crop'
            },
            {
                id: 15,
                name: 'Heritage Kanchipuram',
                category: 'Kanchipuram Saree',
                price: 11000,
                image: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 16,
                name: 'Premium Banarasi Silk',
                category: 'Banarasi Saree',
                price: 14500,
                image: 'https://images.pexels.com/photos/1598506/pexels-photo-1598506.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            },
            {
                id: 17,
                name: 'Regal Paithani Saree',
                category: 'Paithani Saree',
                price: 18000,
                image: 'https://images.unsplash.com/photo-1601925260368-ae2f83d3f195?w=600&h=600&fit=crop'
            },
            {
                id: 18,
                name: 'Luxury Nighty Collection',
                category: 'Nighty',
                price: 1200,
                image: 'https://images.pexels.com/photos/1598504/pexels-photo-1598504.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop'
            }
        ];
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}

// Get all products
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Get cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Add to cart
function addToCart(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Buy now - redirect to cart page
function buyNow(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) return;

    // Add to cart first
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Redirect to cart page
    window.location.href = 'cart.html';
}

// Update cart count
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Display products
function displayProducts(productsToShow = null) {
    const products = productsToShow || getProducts();
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;

    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="empty-state"><p>No products found.</p></div>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/600x600/667eea/ffffff?text=${encodeURIComponent(product.name)}';">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <div class="product-buttons">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id})">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products by category
function filterProducts(category) {
    const products = getProducts();
    const sectionTitle = document.getElementById('section-title');
    
    if (category === 'all') {
        displayProducts(products);
        if (sectionTitle) sectionTitle.textContent = 'All Products';
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered);
        if (sectionTitle) sectionTitle.textContent = category;
    }
    
    // Update active menu item
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    displayProducts();
    updateCartCount();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

