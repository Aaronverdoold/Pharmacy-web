document.addEventListener('DOMContentLoaded', () => {
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCountSpan = document.querySelector('.cart-button span');
    const cartTotal = document.querySelector('.cart-total span');
    let cart = [];

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
});
