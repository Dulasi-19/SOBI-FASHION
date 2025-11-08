# Sobi Fashion - E-commerce Website

A complete dress sales website for Sobi Fashion with product catalog, shopping cart, billing system, payment options, and admin features.

## Features

- **Product Catalog**: Browse products by category (Cotton Saree, Poonam Saree, Kanchipuram Saree, Banarasi Saree, Paithani Saree, Nighty)
- **Shopping Cart**: Add items to cart with quantity management
- **Billing System**: Automatic calculation of subtotal, tax (5%), and total
- **Payment Options**: UPI payment with QR code scanner
- **Bill Printing**: Generate and print bills after payment
- **Admin Panel**: Full CRUD operations for product management
- **Sales Report**: Monthly sales report with filtering and export functionality
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Project Structure

```
/
├── index.html              # Main page with product catalog
├── admin.html              # Admin panel for managing products
├── cart.html               # Shopping cart and billing
├── sales-report.html       # Monthly sales report
├── css/
│   ├── style.css          # Main styles
│   ├── admin.css          # Admin panel styles
│   ├── cart.css           # Cart and billing styles
│   └── sales.css          # Sales report styles
├── js/
│   ├── main.js            # Product display, cart functionality
│   ├── admin.js           # CRUD operations for products
│   ├── cart.js            # Cart management, billing
│   └── sales.js           # Sales report generation
└── images/                # Product images folder
```

## How to Use

### Getting Started

1. Open `index.html` in a web browser
2. The website uses localStorage to store data, so no server setup is required

### For Customers

1. **Browse Products**: Navigate through product categories using the menu
2. **Add to Cart**: Click on any product card or the "Add to Cart" button
3. **View Cart**: Click on "Cart" in the navigation menu
4. **Manage Cart**: Update quantities or remove items
5. **Checkout**: Click "Pay Now" to proceed to payment
6. **Payment**: Use the UPI ID or scan the QR code to make payment
7. **Print Bill**: After confirming payment, the bill will be automatically generated and printed

### For Admin

1. **Access Admin Panel**: Click on "Admin" in the navigation menu
2. **Add Product**: Click "Add New Product" and fill in the form
3. **Edit Product**: Click "Edit" on any product in the table
4. **Delete Product**: Click "Delete" on any product (with confirmation)
5. **View Sales Report**: Click "Sales Report" to view monthly sales
6. **Filter Sales**: Select month and year to filter sales data
7. **Export Report**: Click "Export Report" to download sales data as CSV

## Product Categories

- Cotton Saree
- Poonam Saree
- Kanchipuram Saree
- Banarasi Saree
- Paithani Saree
- Nighty

## Payment Details

- **UPI ID**: sobi.fashion@paytm
- **Payment Method**: UPI with QR code scanner
- **Tax**: 5% GST applied on all orders

## Data Storage

All data is stored in browser's localStorage:
- Products: `localStorage.getItem('products')`
- Cart: `localStorage.getItem('cart')`
- Sales: `localStorage.getItem('sales')`

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Notes

- Product images use placeholder URLs by default. Replace with actual image URLs in the admin panel
- All prices are in Indian Rupees (₹)
- Sales reports are filtered by month and year
- Bills can be printed directly from the browser

## Default Products

The website comes with 6 default products (one for each category) that can be managed through the admin panel.


