document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountSpan = document.querySelector('.cart-button span');
    const cartTotal = document.querySelector('.cart-total span');
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    let cart = [];

    // Search functionality
    function filterProducts(searchTerm) {
        const products = document.querySelectorAll('.product');
        const searchTermLower = searchTerm.toLowerCase();

        products.forEach(product => {
            const productTitle = product.querySelector('.product-title').textContent.toLowerCase();
            if (productTitle.includes(searchTermLower)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
    });

    // Handle search button click
    searchButton.addEventListener('click', () => {
        filterProducts(searchInput.value);
    });

    // Show/hide cart dropdown when clicking the cart button
    cartButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing when clicking the cart button
        cartDropdown.classList.toggle('show');
    });

    // Prevent clicks inside the cart dropdown from closing it
    cartDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Close the cart dropdown when clicking outside
    document.addEventListener('click', () => {
        cartDropdown.classList.remove('show');
    });

    // Handle adding products to cart
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', () => {
            const product = button.closest('.product');
            const title = product.querySelector('.product-title').textContent;
            const price = parseFloat(product.querySelector('.product-price').textContent.replace('€', '').trim());
            const imageSrc = product.querySelector('.product-image img').src;

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ title, price, imageSrc, quantity: 1 });
            }

            updateCart();
            cartButton.classList.add('pulse');
            setTimeout(() => cartButton.classList.remove('pulse'), 500);
        });
    });

    // Update cart display
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Je winkelwagen is leeg.</div>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img class="cart-item-image" src="${item.imageSrc}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item" title="Verwijderen">×</button>
                `;
                cartItemsContainer.appendChild(cartItem);

                // Increase quantity
                cartItem.querySelector('.increase').addEventListener('click', () => {
                    item.quantity++;
                    updateCart();
                });

                // Decrease quantity
                cartItem.querySelector('.decrease').addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    updateCart();
                });

                // Remove item
                cartItem.querySelector('.remove-item').addEventListener('click', () => {
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }

        cartTotal.textContent = `€${total.toFixed(2)}`;
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Checkout Popup Functionality
    const checkoutPopup = document.getElementById('checkoutPopup');
    const closeCheckout = document.querySelector('.close-checkout');
    const paymentTotal = document.getElementById('payment-total');
    const payButton = document.querySelector('.pay-button');

    // Show checkout popup when checkout button is clicked
    document.querySelector('.checkout-button').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        checkoutPopup.classList.add('active');
        paymentTotal.textContent = `€${total.toFixed(2)}`;
    });

    // Close checkout popup
    closeCheckout.addEventListener('click', function() {
        checkoutPopup.classList.remove('active');
    });

    // Close checkout popup when clicking outside
    checkoutPopup.addEventListener('click', function(e) {
        if (e.target === checkoutPopup) {
            checkoutPopup.classList.remove('active');
        }
    });

    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
    });

    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
    });

    // Handle payment submission
    payButton.addEventListener('click', function() {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;

        // Basic validation
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            alert('Please fill in all payment details');
            return;
        }

        // Simulate payment processing
        payButton.textContent = 'Processing...';
        payButton.disabled = true;

        setTimeout(() => {
            alert('Payment successful! Thank you for your purchase.');
            checkoutPopup.classList.remove('active');
            clearCart();
            payButton.textContent = 'Pay Now';
            payButton.disabled = false;
        }, 2000);
    });

    // Payment Method Handling
    const paymentMethods = document.querySelectorAll('.payment-method');
    const cardPayment = document.getElementById('cardPayment');
    const idealPayment = document.getElementById('idealPayment');

    // Initialize payment method
    paymentMethods[0].classList.add('active');
    cardPayment.style.display = 'block';
    idealPayment.style.display = 'none';

    // Handle payment method switching
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Show/hide appropriate form
            if (this.dataset.method === 'card') {
                cardPayment.style.display = 'block';
                idealPayment.style.display = 'none';
            } else if (this.dataset.method === 'ideal') {
                cardPayment.style.display = 'none';
                idealPayment.style.display = 'block';
            }
        });
    });

    // Handle bank selection
    const bankSelect = document.getElementById('bankSelect');
    bankSelect.addEventListener('change', function() {
        // Here you would typically handle the bank selection
        // For example, you might want to store the selected bank
        // or perform some validation
        console.log('Selected bank:', this.value);
    });
});
