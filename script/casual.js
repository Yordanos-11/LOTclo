document.addEventListener('DOMContentLoaded', () => {
    // === Variables ===
    const gridContainer = document.querySelector('.casual-products-grid');
    const allItems = Array.from(gridContainer.children).filter(child => child.tagName === 'A' || child.classList.contains('casual-product-card'));

    // Parse URL Parameter for Page
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1; // Default to 1

    const categoryItems = document.querySelectorAll('.category-list li');
    const sizeBtns = document.querySelectorAll('.size-btn');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const pageNumbersContainer = document.querySelector('.page-numbers');

    // State
    let selectedCategory = 'all';
    let selectedSize = 'all';
    const itemsPerPage = 6;

    // === Rendering ===

    function updateProductDisplay() {
        // First, apply Category/Size filters to determine "valid" items
        const validItems = allItems.filter(item => {
            const card = item.querySelector('.casual-product-card') || item;
            const cat = card.getAttribute('data-category');
            const size = card.getAttribute('data-size');

            const catMatch = selectedCategory === 'all' || cat === selectedCategory;
            const sizeMatch = selectedSize === 'all' || size === selectedSize;

            return catMatch && sizeMatch;
        });

        // Loop through ALL items to set display
        allItems.forEach(item => {
            item.style.display = 'none';
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Show only valid items in the current page range
        validItems.slice(startIndex, endIndex).forEach(item => {
            item.style.display = 'block';
        });

        // Update Active Class on Static Links
        updatePaginationLinks();
    }

    function updatePaginationLinks() {
        // Highlight active number
        const nums = document.querySelectorAll('.page-num');
        nums.forEach(link => {
            link.classList.remove('active');
            // Check if link href matches current page? Or just text content?
            // Since we know they are 1-5, text matched is fine.
            let pageNum = parseInt(link.innerText.trim());
            if (pageNum === currentPage) {
                link.classList.add('active');
            }
        });

        // Update Prev/Next Hrefs dynamically based on current page
        // Prev
        if (currentPage > 1) {
            prevBtn.href = `?page=${currentPage - 1}`;
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        } else {
            prevBtn.removeAttribute('href'); // or href="#"
            prevBtn.style.opacity = '0.5';
            prevBtn.style.pointerEvents = 'none';
        }

        // Next
        // We need max pages to know if we can go next.
        // Assume 5 for the static links provided? Or calc from items?
        // Let's calc from items to be safe, but default to 5 if items are missing (user testing).
        let totalPages = Math.ceil(allItems.length / itemsPerPage);
        if (totalPages < 1) totalPages = 1;

        if (currentPage < totalPages) {
            nextBtn.href = `?page=${currentPage + 1}`;
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        } else {
            nextBtn.removeAttribute('href');
            nextBtn.style.opacity = '0.5';
            nextBtn.style.pointerEvents = 'none';
        }
    }

    // === Events ===

    // Category Filter (Resets to page 1 via JS state only.
    // Changing filter resets view to page 1 logic, but URL might say page=2.
    // Resetting current page variable is safest for "current view" even if URL is stale.)

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const categoryName = item.childNodes[0].textContent.trim();

            if (item.classList.contains('active')) {
                item.classList.remove('active');
                selectedCategory = 'all';
            } else {
                categoryItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                selectedCategory = categoryName;
            }
            currentPage = 1;
            updateProductDisplay();
        });
    });

    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sizeName = btn.textContent.trim();

            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                selectedSize = 'all';
            } else {
                sizeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedSize = sizeName;
            }
            currentPage = 1;
            updateProductDisplay();
        });
    });

    // Quick Add Delegation
    // === Add to Cart Logic ===

    function addToCart(btn) {
        const card = btn.closest('.casual-product-card');
        if (!card) return;

        // Extract data
        const nameElement = card.querySelector('.casual-product-name');
        const priceElement = card.querySelector('.casual-product-price'); // Can be the div or inside it
        const imageElement = card.querySelector('.casual-product-image img');

        // Fallbacks for data to prevent errors
        const name = nameElement ? nameElement.innerText : 'Unknown Product';

        // Handle price - cleanup currency symbols if present
        let priceStr = card.getAttribute('data-price');
        if (!priceStr && priceElement) {
            priceStr = priceElement.innerText.replace(/[^0-9.]/g, '');
        }
        const price = parseInt(priceStr) || 0;

        const image = imageElement ? imageElement.src : '';
        const size = card.getAttribute('data-size') || 'Medium';
        const color = 'Black'; // Default color if not specified

        const newItem = {
            id: Date.now(), // Simple unique ID
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
        const isIcon = btn.querySelector('i'); // Check if it's the icon button

        if (btn.classList.contains('quick-add-btn')) {
            btn.innerHTML = '✓';
            btn.style.background = '#000';
            btn.style.color = '#fff';
        } else {
            // It's the cart icon button
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.color = '#28a745'; // Green for success
        }

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.color = '';
        }, 1000);
    }

    // Attach listeners to both types of buttons
    const productButtons = document.querySelectorAll('.quick-add-btn, .product-cart-btn');

    productButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop link navigation
            e.stopPropagation(); // Stop event bubbling
            addToCart(btn);
        });
    });

    // Init Logic
    updateProductDisplay();
});