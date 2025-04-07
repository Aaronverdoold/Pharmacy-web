document.addEventListener('DOMContentLoaded', function () {
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.getElementById('cart-dropdown');

    let cart = [];

    // Update de cart dropdown
    function updateCartDropdown() {
        const cartDropdown = document.getElementById('cart-dropdown');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalPriceElement = document.getElementById('total-price');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const checkoutButton = document.getElementById('checkout-button');

        // Clear existing items in the dropdown
        cartItemsContainer.innerHTML = '';

        // Calculate total price and display products
        let totalPrice = 0;
        cart.forEach(item => {
            const { title, price, quantity, image } = item;

            // Create product item element
            const productItem = document.createElement('div');
            productItem.classList.add('cart-item');

            productItem.innerHTML = `
            <img src="${image}" alt="${title}">
            <span>${title} x ${quantity}</span>
            <span>€${(price * quantity).toFixed(2)}</span>
            <i class="ri-close-line close-icon" data-title="${title}"></i>
        `;

            // Append to the dropdown
            cartItemsContainer.appendChild(productItem);

            // Update total price
            totalPrice += price * quantity;
        });

        // Update the total price in the dropdown
        totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`;

        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

        // Show the cart dropdown if there are items
        cartDropdown.style.display = cart.length > 0 ? 'block' : 'none';

        // Show the empty cart message if there are no items
        emptyCartMessage.style.display = cart.length === 0 ? 'block' : 'none';

        // Show the checkout button if there are items in the cart
        checkoutButton.style.display = cart.length > 0 ? 'block' : 'none';
    }

// Function to handle checkout button click
    document.getElementById('checkout-button').addEventListener('click', function () {
        // For now, just log to console or redirect to another page
        alert("You are being redirected to the checkout page.");
        // Uncomment below to redirect to a checkout page
        // window.location.href = "checkout-page.html"; // Replace with your actual checkout page URL
    });


    // Function to handle adding items to the cart
    function addToCart(title, price, image) {
        const existingProductIndex = cart.findIndex(item => item.title === title);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push({ title, price, image, quantity: 1 });
        }
        updateCartDropdown();
    }

    // Function to handle removing items from the cart
    function removeFromCart(title) {
        cart = cart.filter(item => item.title !== title);
        updateCartDropdown();
    }

    // Toggle the cart dropdown when cart button is clicked
    cartButton.addEventListener('click', () => {
        cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Remove item from cart when close icon is clicked
    cartDropdown.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-icon')) {
            const title = event.target.getAttribute('data-title');
            removeFromCart(title);
        }
    });

    // Add event listeners for the "Add" buttons of products
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productDiv = event.target.closest('.product');
            const title = productDiv.querySelector('.product-title').textContent;
            const price = parseFloat(productDiv.querySelector('.product-price').textContent.replace('€', ''));
            const image = productDiv.querySelector('.product-image img').src;

            addToCart(title, price, image);
        });
    });
});
