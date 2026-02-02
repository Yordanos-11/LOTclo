document.addEventListener("DOMContentLoaded", () => {
    const subtotalEl = document.getElementById("checkout-subtotal");
    const totalEl = document.getElementById("checkout-total");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const successBox = document.getElementById("order-success");
    const checkoutLayout = document.querySelector(".checkout-layout");

    
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");
    const paymentMethod = document.getElementById("payment-method");
    const errorMsg = document.getElementById("error-msg");

    let cartItems = JSON.parse(localStorage.getItem("lotta-cart")) || [];

    function calculateTotals() {
        let subtotal = 0;

        cartItems.forEach(item => {
            subtotal += parseInt(item.price) * parseInt(item.qty);
        });

        subtotalEl.textContent = `${subtotal} birr`;
        totalEl.textContent = `${subtotal} birr`;
    }

    placeOrderBtn.addEventListener("click", () => {

        // ORIGINAL cart check 
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // EMPTY FIELD CHECK
        if (
            nameInput.value === "" ||
            phoneInput.value === "" ||
            paymentMethod.value === ""
        ) {
            errorMsg.innerHTML = "Error: Please fill in all required fields.";
            errorMsg.style.display = "block";
            return;
        }

        // PHONE NUMBER CHECK 
        if (isNaN(phoneInput.value)) {
            errorMsg.innerHTML = "Error: Phone number must contain numbers only.";
            errorMsg.style.display = "block";
            return;
        }

        errorMsg.style.display = "none";

        
        localStorage.removeItem("lotta-cart");
        checkoutLayout.style.display = "none";
        successBox.style.display = "block";
    });

    calculateTotals();
});
