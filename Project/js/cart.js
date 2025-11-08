// Get cart
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
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

// Display cart items
function displayCart() {
    const cart = getCart();
    const cartTbody = document.getElementById('cart-tbody');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');

    if (!cartTbody) return;

    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartContent) cartContent.style.display = 'block';

    cartTbody.innerHTML = cart.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>₹${item.price.toLocaleString()}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>₹${(item.price * item.quantity).toLocaleString()}</td>
            <td><button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button></td>
        </tr>
    `).join('');

    updateCartSummary();
}

// Update quantity
function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(id);
        return;
    }

    let cart = getCart();
    const item = cart.find(item => item.id === id);
    
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(id) {
    if (!confirm('Remove this item from cart?')) {
        return;
    }

    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // No tax

    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    if (taxElement) {
        taxElement.parentElement.style.display = 'none'; // Hide tax row
    }
    if (totalElement) totalElement.textContent = `₹${total.toLocaleString()}`;
}

// Clear cart
function clearCart() {
    if (!confirm('Are you sure you want to clear the entire cart?')) {
        return;
    }

    localStorage.setItem('cart', JSON.stringify([]));
    displayCart();
    updateCartCount();
    showNotification('Cart cleared');
}

// Proceed to payment
function proceedToPayment() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Validate address fields
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const city = document.getElementById('customer-city').value.trim();
    const pincode = document.getElementById('customer-pincode').value.trim();

    if (!name || !phone || !address || !city || !pincode) {
        alert('Please fill in all delivery address fields!');
        return;
    }

    // Validate phone number
    if (phone.length < 10 || phone.length > 15) {
        alert('Please enter a valid phone number!');
        return;
    }

    // Validate pincode
    if (pincode.length !== 6 || isNaN(pincode)) {
        alert('Please enter a valid 6-digit pincode!');
        return;
    }

    const cartSummary = updateCartSummary();
    const cartTotal = getCartTotal();
    
    const paymentAmount = document.getElementById('payment-amount');
    if (paymentAmount) {
        paymentAmount.textContent = `₹${cartTotal.toLocaleString()}`;
    }

    // Update delivery summary in modal
    document.getElementById('summary-name').textContent = name;
    document.getElementById('summary-phone').textContent = `Phone: ${phone}`;
    document.getElementById('summary-address').textContent = address;
    document.getElementById('summary-city').textContent = `${city} - ${pincode}`;
    document.getElementById('summary-pincode').textContent = '';

    // Update QR code with amount
    const qrCodeImage = document.getElementById('qr-code-image');
    if (qrCodeImage) {
        qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=sobi.fashion@paytm&pn=Sobi%20Fashion&am=${cartTotal}&cu=INR`;
    }

    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Get cart total
function getCartTotal() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return subtotal; // No tax
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Complete payment
function completePayment() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Get address details
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const city = document.getElementById('customer-city').value.trim();
    const pincode = document.getElementById('customer-pincode').value.trim();

    if (!name || !phone || !address || !city || !pincode) {
        alert('Please fill in all delivery address fields!');
        return;
    }

    // Save sale to sales history
    const sale = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: name,
            phone: phone,
            address: address,
            city: city,
            pincode: pincode
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: 0, // No tax
        total: getCartTotal()
    };

    let sales = JSON.parse(localStorage.getItem('sales') || '[]');
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));

    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Generate and print bill
    generateBill(sale);
    
    // Close modal
    closePaymentModal();
    
    // Update display
    displayCart();
    updateCartCount();
    
    showNotification('Payment successful! Bill generated.');
}

// Generate bill
function generateBill(sale) {
    const billDate = document.getElementById('bill-date');
    const billNumber = document.getElementById('bill-number');
    const billItems = document.getElementById('bill-items');
    const billSubtotal = document.getElementById('bill-subtotal');
    const billTax = document.getElementById('bill-tax');
    const billTotal = document.getElementById('bill-total');

    if (billDate) {
        billDate.textContent = new Date(sale.date).toLocaleString();
    }

    if (billNumber) {
        billNumber.textContent = `#${sale.id}`;
    }

    // Add customer address to bill header if exists
    if (sale.customer) {
        const billHeader = document.querySelector('.bill-header');
        if (billHeader) {
            // Remove existing address if any
            const existingAddress = billHeader.querySelector('.bill-address-section');
            if (existingAddress) {
                existingAddress.remove();
            }
            
            const addressSection = document.createElement('div');
            addressSection.className = 'bill-address-section';
            addressSection.style.cssText = 'text-align: left; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ccc;';
            addressSection.innerHTML = `
                <p><strong>Delivery Address:</strong></p>
                <p>${sale.customer.name}</p>
                <p>Phone: ${sale.customer.phone}</p>
                <p>${sale.customer.address}</p>
                <p>${sale.customer.city} - ${sale.customer.pincode}</p>
            `;
            billHeader.appendChild(addressSection);
        }
    }

    if (billItems) {
        billItems.innerHTML = sale.items.map(item => `
            <div class="bill-item">
                <div>
                    <strong>${item.name}</strong> (${item.category})<br>
                    ${item.quantity} x ₹${item.price.toLocaleString()}
                </div>
                <div>₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `).join('');
    }

    if (billSubtotal) {
        billSubtotal.textContent = `₹${sale.subtotal.toLocaleString()}`;
    }

    if (billTax) {
        billTax.textContent = `₹${sale.tax.toLocaleString()}`;
    }

    if (billTotal) {
        billTotal.textContent = `₹${sale.total.toLocaleString()}`;
    }

    // Print bill
    const billPrint = document.getElementById('bill-print');
    if (billPrint) {
        billPrint.style.display = 'block';
        
        // Create print window
        const printWindow = window.open('', '_blank');
        const customerAddressHTML = sale.customer ? `
            <div class="bill-address-section">
                <p><strong>Delivery Address:</strong></p>
                <p>${sale.customer.name}</p>
                <p>Phone: ${sale.customer.phone}</p>
                <p>${sale.customer.address}</p>
                <p>${sale.customer.city} - ${sale.customer.pincode}</p>
            </div>
        ` : '';
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Bill - Sobi Fashion</title>
                    <style>
                        body {
                            font-family: 'Courier New', monospace;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 2rem;
                        }
                        .bill-header {
                            text-align: center;
                            border-bottom: 2px solid #333;
                            padding-bottom: 1rem;
                            margin-bottom: 1rem;
                        }
                        .bill-header h1 {
                            font-size: 2rem;
                            margin-bottom: 0.5rem;
                        }
                        .bill-address-section {
                            text-align: left;
                            margin-top: 1rem;
                            padding-top: 1rem;
                            border-top: 1px solid #ccc;
                        }
                        .bill-item {
                            display: flex;
                            justify-content: space-between;
                            padding: 0.5rem 0;
                            border-bottom: 1px dotted #ccc;
                        }
                        .bill-summary {
                            margin-top: 1.5rem;
                            border-top: 2px solid #333;
                            padding-top: 1rem;
                        }
                        .bill-summary p {
                            display: flex;
                            justify-content: space-between;
                            margin: 0.5rem 0;
                        }
                        .bill-summary p[style*="display: none"] {
                            display: none !important;
                        }
                        .bill-total {
                            font-weight: bold;
                            font-size: 1.2rem;
                            border-top: 2px solid #333;
                            padding-top: 0.5rem;
                            margin-top: 0.5rem;
                        }
                        .bill-footer {
                            text-align: center;
                            margin-top: 2rem;
                            padding-top: 1rem;
                            border-top: 1px solid #ccc;
                        }
                        @media print {
                            body { margin: 0; padding: 1rem; }
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-header">
                        <h1>Sobi Fashion</h1>
                        <p>Dress Sales</p>
                        <p>Date: ${new Date(sale.date).toLocaleString()}</p>
                        <p>Bill No: #${sale.id}</p>
                        ${customerAddressHTML}
                    </div>
                    <div class="bill-items">
                        ${sale.items.map(item => `
                            <div class="bill-item">
                                <div>
                                    <strong>${item.name}</strong> (${item.category})<br>
                                    ${item.quantity} x ₹${item.price.toLocaleString()}
                                </div>
                                <div>₹${(item.price * item.quantity).toLocaleString()}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="bill-summary">
                        <p>Subtotal: <span>₹${sale.subtotal.toLocaleString()}</span></p>
                        <p style="display: none;">Tax (5%): <span>₹${sale.tax.toLocaleString()}</span></p>
                        <p class="bill-total">Total: <span>₹${sale.total.toLocaleString()}</span></p>
                    </div>
                    <div class="bill-footer">
                        <p>Thank you for your purchase!</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        billPrint.style.display = 'none';
    }
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

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closePaymentModal();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    updateCartCount();
    
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

