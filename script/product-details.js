document.addEventListener('DOMContentLoaded', () => {

    // Quantity Logic
    const qtyBtnMinus = document.querySelector('.qty-btn.minus');
    const qtyBtnPlus = document.querySelector('.qty-btn.plus'); // Changed from .qty-btn.plus (no space)
    const qtyValueSpan = document.querySelector('.qty-value');

    if (qtyBtnMinus && qtyBtnPlus && qtyValueSpan) {
        qtyBtnMinus.addEventListener('click', () => {
            let currentQty = parseInt(qtyValueSpan.innerText);
            if (currentQty > 1) {
                qtyValueSpan.innerText = currentQty - 1;
            }
        });

        qtyBtnPlus.addEventListener('click', () => {
            let currentQty = parseInt(qtyValueSpan.innerText);
            qtyValueSpan.innerText = currentQty + 1;
        });
    }

    // Add to Cart Button Logic
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            // Check selections
            const selectedSizeBtn = document.querySelector('.size-btn.selected');
            const selectedColorEl = document.querySelector('.color-swatch.selected');

            // Determine values
            const name = document.querySelector('.product-title').innerText;
            const priceText = document.querySelector('.product-price-large').innerText;
            const price = parseInt(priceText.replace('$', '').replace(',', ''));
            const size = selectedSizeBtn ? selectedSizeBtn.innerText : 'One Size';

            // Determine color from class list (cleaner approach)
            let color = 'Default';
            if (selectedColorEl) {
                // Get all classes, filter out utility classes
                const classes = Array.from(selectedColorEl.classList);
                const colorClass = classes.find(c => c !== 'color-swatch' && c !== 'selected');
                if (colorClass) {
                    // Capitalize first letter
                    color = colorClass.charAt(0).toUpperCase() + colorClass.slice(1);
                }
            }

            const qtyText = document.querySelector('.qty-value').innerText;
            const qty = parseInt(qtyText);

            // Image
            const mainImgSrc = document.querySelector('.main-image img').src;

            // Create Item
            const newItem = {
                id: Date.now(),
                name: name,
                price: price,
                size: size,
                color: color,
                image: mainImgSrc,
                qty: qty
            };

            // Save to LocalStorage
            let cartItems = JSON.parse(localStorage.getItem('lotta-cart')) || [];

            // Check duplicates
            const existingIndex = cartItems.findIndex(item => item.name === newItem.name && item.size === newItem.size && item.color === newItem.color);
            if (existingIndex > -1) {
                cartItems[existingIndex].qty += newItem.qty;
            } else {
                cartItems.push(newItem);
            }

            localStorage.setItem('lotta-cart', JSON.stringify(cartItems));

            // Optional: Provide feedback (could be a toast or button text change)
            const originalText = addToCartBtn.innerText;
            addToCartBtn.innerText = 'Added!';
            addToCartBtn.style.backgroundColor = '#4CAF50';

            setTimeout(() => {
                addToCartBtn.innerText = originalText;
                addToCartBtn.style.backgroundColor = '';
            }, 1000);
        });
    }
});
