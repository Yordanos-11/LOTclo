document.addEventListener('DOMContentLoaded', () => {
    // Select Elements
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyMessage = document.querySelector('.empty-cart-message');
    const subtotalDisplay = document.getElementById('subtotal-display');
    const totalDisplay = document.getElementById('total-display');

    // State
    // Read from localStorage (Key: 'lotta-cart')
    let cartItems = JSON.parse(localStorage.getItem('lotta-cart')) || [];

    function saveCart() {
        localStorage.setItem('lotta-cart', JSON.stringify(cartItems));
    }

    function renderCart() {
        // Clear current items (but keep empty message)
        const currentItems = document.querySelectorAll('.cart-item');
        currentItems.forEach(i => i.remove());

        if (cartItems.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';

            cartItems.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.setAttribute('data-index', index);

                // HTML Structure
                itemEl.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <div class="item-header">
                            <h3 class="item-name">${item.name}</h3>
                            <button class="delete-btn" data-index="${index}">🗑️</button>
                        </div>
                        <p class="item-meta">Size: ${item.size}</p>
                        <p class="item-meta">Color: ${item.color}</p>
                        <div class="item-footer">
                            <div class="item-price">${item.price} birr</div>
                            <div class="quantity-controls">
                                <button class="qty-btn minus" data-index="${index}">−</button>
                                <span class="qty-value">${item.qty}</span>
                                <button class="qty-btn plus" data-index="${index}">+</button>
                            </div>
                        </div>
                    </div>
                `;

                cartItemsContainer.appendChild(itemEl);
            });
        }

        updateTotals();
        attachListeners();
    }

    function updateTotals() {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += (parseInt(item.price) * parseInt(item.qty));
        });

        // No Discount Logic
        let total = subtotal;

        subtotalDisplay.textContent = `${subtotal} birr`;
        totalDisplay.textContent = `${total} birr`;
    }

    function attachListeners() {
        // Delete
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cartItems.splice(index, 1);
                saveCart();
                renderCart();
            });
        });

        // Quantity Minus
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cartItems[index].qty > 1) {
                    cartItems[index].qty--;
                    saveCart();
                    renderCart();
                }
            });
        });

        // Quantity Plus
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cartItems[index].qty++;
                saveCart();
                renderCart();
            });
        });
    }

    // Init
    renderCart();
});
