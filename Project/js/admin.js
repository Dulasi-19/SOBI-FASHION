// Get all products
function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.match('image.*')) {
        alert('Please select an image file!');
        event.target.value = '';
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB!');
        event.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        document.getElementById('product-image').value = imageData;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('image-preview-container');
        preview.src = imageData;
        container.style.display = 'block';
        
        // Clear URL input
        document.getElementById('product-image-url').value = '';
    };
    reader.readAsDataURL(file);
}

// Handle image URL input
function handleImageUrl() {
    const url = document.getElementById('product-image-url').value;
    if (url) {
        document.getElementById('product-image').value = url;
        
        // Show preview
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('image-preview-container');
        preview.src = url;
        container.style.display = 'block';
        
        // Clear file input
        document.getElementById('product-image-file').value = '';
    }
}

// Remove image
function removeImage() {
    document.getElementById('product-image').value = '';
    document.getElementById('product-image-file').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('image-preview-container').style.display = 'none';
}

// Save product (create or update)
function saveProduct(event) {
    event.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value;

    if (!image) {
        alert('Please upload an image or enter an image URL!');
        return;
    }

    let products = getProducts();
    
    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = {
                id: parseInt(id),
                name,
                category,
                price,
                image
            };
        }
    } else {
        // Create new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            price,
            image
        });
    }

    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    cancelForm();
    showNotification(id ? 'Product updated successfully!' : 'Product added successfully!');
}

// Display products in table
function displayProducts() {
    const products = getProducts();
    const tbody = document.getElementById('products-tbody');
    
    if (!tbody) return;

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No products found. Add your first product!</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toLocaleString()}</td>
            <td class="table-actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Edit product
function editProduct(id) {
    const products = getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) return;

    document.getElementById('product-id').value = id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    
    // Show preview if image exists
    if (product.image) {
        const preview = document.getElementById('image-preview');
        const container = document.getElementById('image-preview-container');
        preview.src = product.image;
        container.style.display = 'block';
        
        // Check if it's a URL or base64
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
            document.getElementById('product-image-url').value = product.image;
            document.getElementById('product-image-file').value = '';
        } else {
            document.getElementById('product-image-url').value = '';
            document.getElementById('product-image-file').value = '';
        }
    }
    
    document.getElementById('form-title').textContent = 'Edit Product';
    document.getElementById('product-form-container').style.display = 'block';
    
    // Scroll to form
    document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    let products = getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    showNotification('Product deleted successfully!');
}

// Show add product form
function showAddProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview-container').style.display = 'none';
    document.getElementById('product-image-file').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('form-title').textContent = 'Add New Product';
    document.getElementById('product-form-container').style.display = 'block';
    
    // Scroll to form
    document.getElementById('product-form-container').scrollIntoView({ behavior: 'smooth' });
}

// Cancel form
function cancelForm() {
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview-container').style.display = 'none';
    document.getElementById('product-image-file').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('product-form-container').style.display = 'none';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Add CSS animation for notifications
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
});


