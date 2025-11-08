// Get all sales
function getSales() {
    return JSON.parse(localStorage.getItem('sales') || '[]');
}

// Initialize year dropdown
function initializeYearDropdown() {
    const yearSelect = document.getElementById('year-select');
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    const years = [];
    
    // Get years from sales data
    const sales = getSales();
    sales.forEach(sale => {
        const year = new Date(sale.date).getFullYear();
        if (!years.includes(year)) {
            years.push(year);
        }
    });

    // If no sales, add current year
    if (years.length === 0) {
        years.push(currentYear);
    }

    // Sort years descending
    years.sort((a, b) => b - a);

    // Populate dropdown
    yearSelect.innerHTML = '<option value="all">All Years</option>';
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    });
}

// Filter sales by month
function filterSalesByMonth() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (!monthSelect || !yearSelect) return;

    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;
    const selectedPriceFilter = priceFilter ? priceFilter.value : 'all';
    const selectedSort = sortBy ? sortBy.value : 'date-desc';
    const sales = getSales();

    let filteredSales = sales;

    // Filter by month
    if (selectedMonth !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === parseInt(selectedMonth);
        });
    }

    // Filter by year
    if (selectedYear !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === parseInt(selectedYear);
        });
    }

    // Filter by price range
    if (selectedPriceFilter !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const total = sale.total;
            switch(selectedPriceFilter) {
                case '0-5000':
                    return total >= 0 && total <= 5000;
                case '5000-10000':
                    return total > 5000 && total <= 10000;
                case '10000-20000':
                    return total > 10000 && total <= 20000;
                case '20000+':
                    return total > 20000;
                default:
                    return true;
            }
        });
    }

    // Sort sales
    switch(selectedSort) {
        case 'date-desc':
            filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'date-asc':
            filteredSales.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'price-desc':
            filteredSales.sort((a, b) => b.total - a.total);
            break;
        case 'price-asc':
            filteredSales.sort((a, b) => a.total - b.total);
            break;
        default:
            filteredSales.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    displaySales(filteredSales);
    updateSummary(filteredSales);
}

// Display sales
function displaySales(sales) {
    const salesTbody = document.getElementById('sales-tbody');
    const emptySales = document.getElementById('empty-sales');
    const salesTable = document.getElementById('sales-table');

    if (!salesTbody) return;

    if (sales.length === 0) {
        if (emptySales) emptySales.style.display = 'block';
        if (salesTable) salesTable.style.display = 'none';
        return;
    }

    if (emptySales) emptySales.style.display = 'none';
    if (salesTable) salesTable.style.display = 'table';

    salesTbody.innerHTML = sales.map(sale => {
        const saleDate = new Date(sale.date);
        const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
        
        const itemsList = sale.items.map(item => 
            `<div class="item">${item.name} (${item.category}) - Qty: ${item.quantity}</div>`
        ).join('');

        const customerName = sale.customer ? sale.customer.name : 'N/A';
        const customerAddress = sale.customer ? `${sale.customer.address}, ${sale.customer.city} - ${sale.customer.pincode}` : 'N/A';
        
        return `
            <tr>
                <td>${saleDate.toLocaleDateString()} ${saleDate.toLocaleTimeString()}</td>
                <td>#${sale.id}</td>
                <td>
                    <strong>${customerName}</strong><br>
                    ${sale.customer ? sale.customer.phone : ''}
                </td>
                <td style="max-width: 200px; font-size: 0.9rem;">${customerAddress}</td>
                <td>
                    <div class="sales-items-list">
                        ${itemsList}
                    </div>
                </td>
                <td>${totalItems}</td>
                <td>₹${sale.subtotal.toLocaleString()}</td>
                <td>₹${sale.total.toLocaleString()}</td>
                <td>
                    <button class="btn btn-view" onclick="viewBill(${sale.id})">View Bill</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update summary
function updateSummary(sales) {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalItems = sales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    const totalSalesElement = document.getElementById('total-sales');
    const totalOrdersElement = document.getElementById('total-orders');
    const avgOrderValueElement = document.getElementById('avg-order-value');
    const totalItemsElement = document.getElementById('total-items');

    if (totalSalesElement) {
        totalSalesElement.textContent = `₹${totalSales.toLocaleString()}`;
    }

    if (totalOrdersElement) {
        totalOrdersElement.textContent = totalOrders;
    }

    if (avgOrderValueElement) {
        avgOrderValueElement.textContent = `₹${Math.round(avgOrderValue).toLocaleString()}`;
    }

    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }
}

// View bill
function viewBill(saleId) {
    const sales = getSales();
    const sale = sales.find(s => s.id === saleId);
    
    if (!sale) {
        alert('Bill not found!');
        return;
    }

    // Generate bill HTML
    const billHTML = `
        <html>
            <head>
                <title>Bill #${sale.id} - Sobi Fashion</title>
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
                    ${sale.customer ? `
                        <div class="bill-address">
                            <p><strong>Delivery Address:</strong></p>
                            <p>${sale.customer.name}</p>
                            <p>${sale.customer.phone}</p>
                            <p>${sale.customer.address}</p>
                            <p>${sale.customer.city} - ${sale.customer.pincode}</p>
                        </div>
                    ` : ''}
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
                    <p class="bill-total">Total: <span>₹${sale.total.toLocaleString()}</span></p>
                </div>
                <div class="bill-footer">
                    <p>Thank you for your purchase!</p>
                </div>
            </body>
        </html>
    `;

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.print();
}

// Export report
function exportReport() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    if (!monthSelect || !yearSelect) return;

    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;
    const sales = getSales();

    let filteredSales = sales;

    if (selectedMonth !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === parseInt(selectedMonth);
        });
    }

    if (selectedYear !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === parseInt(selectedYear);
        });
    }

    // Create CSV content
    let csv = 'Date,Bill No,Customer Name,Phone,Address,City,Pincode,Items,Quantity,Subtotal,Total\n';
    
    filteredSales.forEach(sale => {
        const saleDate = new Date(sale.date);
        const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
        const itemsList = sale.items.map(item => `${item.name} (${item.quantity})`).join('; ');
        const customerName = sale.customer ? sale.customer.name : 'N/A';
        const customerPhone = sale.customer ? sale.customer.phone : 'N/A';
        const customerAddress = sale.customer ? sale.customer.address.replace(/"/g, '""') : 'N/A';
        const customerCity = sale.customer ? sale.customer.city : 'N/A';
        const customerPincode = sale.customer ? sale.customer.pincode : 'N/A';
        
        csv += `${saleDate.toLocaleDateString()},#${sale.id},"${customerName}","${customerPhone}","${customerAddress}","${customerCity}","${customerPincode}","${itemsList}",${totalItems},${sale.subtotal},${sale.total}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${selectedMonth !== 'all' ? monthSelect.options[monthSelect.selectedIndex].text : 'all'}-${selectedYear !== 'all' ? selectedYear : 'all'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification('Report exported successfully!');
}

// Print report
function printReport() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    if (!monthSelect || !yearSelect) return;

    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;
    const sales = getSales();

    let filteredSales = sales;

    if (selectedMonth !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === parseInt(selectedMonth);
        });
    }

    if (selectedYear !== 'all') {
        filteredSales = filteredSales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getFullYear() === parseInt(selectedYear);
        });
    }

    // Calculate totals
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalOrders = filteredSales.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
    const totalItems = filteredSales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    // Create print window
    const printWindow = window.open('', '_blank');
    const monthName = selectedMonth !== 'all' ? monthSelect.options[monthSelect.selectedIndex].text : 'All Months';
    const yearName = selectedYear !== 'all' ? selectedYear : 'All Years';
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Sales Report - Sobi Fashion</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 2rem;
                        color: #333;
                    }
                    .report-header {
                        text-align: center;
                        border-bottom: 3px solid #667eea;
                        padding-bottom: 1rem;
                        margin-bottom: 2rem;
                    }
                    .report-header h1 {
                        color: #667eea;
                        margin-bottom: 0.5rem;
                    }
                    .report-summary {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 1rem;
                        margin-bottom: 2rem;
                    }
                    .summary-box {
                        background: #f8f9fa;
                        padding: 1rem;
                        border-radius: 5px;
                        text-align: center;
                        border: 2px solid #667eea;
                    }
                    .summary-box h3 {
                        margin: 0 0 0.5rem 0;
                        color: #667eea;
                        font-size: 0.9rem;
                    }
                    .summary-box p {
                        margin: 0;
                        font-size: 1.5rem;
                        font-weight: bold;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 1rem;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 0.75rem;
                        text-align: left;
                    }
                    th {
                        background: #667eea;
                        color: white;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background: #f8f9fa;
                    }
                    .report-footer {
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 2px solid #667eea;
                        text-align: center;
                        color: #666;
                    }
                    @media print {
                        body { margin: 0; padding: 1rem; }
                        .report-summary { grid-template-columns: repeat(2, 1fr); }
                    }
                </style>
            </head>
            <body>
                <div class="report-header">
                    <h1>Sobi Fashion - Sales Report</h1>
                    <p><strong>Period:</strong> ${monthName} ${yearName}</p>
                    <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <div class="report-summary">
                    <div class="summary-box">
                        <h3>Total Sales</h3>
                        <p>₹${totalSales.toLocaleString()}</p>
                    </div>
                    <div class="summary-box">
                        <h3>Total Orders</h3>
                        <p>${totalOrders}</p>
                    </div>
                    <div class="summary-box">
                        <h3>Avg Order Value</h3>
                        <p>₹${Math.round(avgOrderValue).toLocaleString()}</p>
                    </div>
                    <div class="summary-box">
                        <h3>Total Items Sold</h3>
                        <p>${totalItems}</p>
                    </div>
                </div>
                
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Bill No</th>
                            <th>Customer</th>
                            <th>Address</th>
                            <th>Items</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredSales.map(sale => {
                            const saleDate = new Date(sale.date);
                            const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                            const itemsList = sale.items.map(item => `${item.name} (${item.quantity})`).join('; ');
                            const customerName = sale.customer ? sale.customer.name : 'N/A';
                            const customerAddress = sale.customer ? `${sale.customer.address}, ${sale.customer.city} - ${sale.customer.pincode}` : 'N/A';
                            
                            return `
                                <tr>
                                    <td>${saleDate.toLocaleDateString()}</td>
                                    <td>#${sale.id}</td>
                                    <td>${customerName}</td>
                                    <td>${customerAddress}</td>
                                    <td>${itemsList}</td>
                                    <td>${totalItems}</td>
                                    <td>₹${sale.subtotal.toLocaleString()}</td>
                                    <td>₹${sale.total.toLocaleString()}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                
                <div class="report-footer">
                    <p>This is a computer-generated report from Sobi Fashion</p>
                    <p>© ${new Date().getFullYear()} Sobi Fashion. All rights reserved.</p>
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showNotification('Report ready for printing!');
}

// Save report as PDF (using browser print to PDF)
function saveReportPDF() {
    printReport(); // Opens print dialog where user can save as PDF
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
    initializeYearDropdown();
    filterSalesByMonth();
    
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

