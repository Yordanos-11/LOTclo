document.addEventListener('DOMContentLoaded', () => {
    // === Add to Cart Logic ===
    function addToCart(btn) {
        const card = btn.closest('.product-card');
        if (!card) return;

        // Extract data
        const nameElement = card.querySelector('.product-name');
        const priceElement = card.querySelector('.product-price');
        const imageElement = card.querySelector('.product-image img');

        // Fallbacks for data to prevent errors
        const name = nameElement ? nameElement.innerText : 'Unknown Product';

        // Handle price - cleanup currency symbols if present
        let priceStr = card.getAttribute('data-price'); // Home page might not have data-price attributes on cards yet, so we rely on text
        if (!priceStr && priceElement) {
            priceStr = priceElement.innerText.replace(/[^0-9.]/g, '');
        }
        const price = parseInt(priceStr) || 0;

        const image = imageElement ? imageElement.src : '';
        const size = 'Medium'; // Default size for home page quick adds
        const color = 'Black'; // Default color

        const newItem = {
            id: Date.now(),
            name: name,
            price: price,
            size: size,
            color: color,
            image: image,
            qty: 1
        };

        // Add to LocalStorage
        let cartItems = JSON.parse(localStorage.getItem('lotta-cart')) || [];
        const existingIndex = cartItems.findIndex(item => item.name === newItem.name && item.size === newItem.size && item.color === newItem.color);

        if (existingIndex > -1) {
            cartItems[existingIndex].qty += 1;
        } else {
            cartItems.push(newItem);
        }

        localStorage.setItem('lotta-cart', JSON.stringify(cartItems));

        // Visual Feedback
        const originalContent = btn.innerHTML;

        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.style.color = '#28a745'; // Green for success

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.color = '';
        }, 1000);
    }

    // Attach listeners
    const cartButtons = document.querySelectorAll('.product-cart-btn');

    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop link navigation
            e.stopPropagation(); // Stop event bubbling
            addToCart(btn);
        });
    });
});
