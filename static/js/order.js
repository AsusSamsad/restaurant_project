// 🌟 Toggle Mobile Menu
function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
    let hamburger = document.querySelector(".hamburger");
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

// 🌟 Update Total Price (based on multiple select items)
function updatePrice() {
    let selectedItems = document.getElementById("food").selectedOptions;
    let quantity = parseInt(document.getElementById("quantity").value);
    let totalPrice = 0;

    for (let item of selectedItems) {
        totalPrice += parseInt(item.value);
    }

    totalPrice *= quantity;
    document.getElementById("total-price").innerText = "₹" + totalPrice;
}

// 🎟️ Apply Discount Coupon
function applyCoupon() {
    let coupon = document.getElementById("coupon").value;
    let totalPrice = parseInt(document.getElementById("total-price").innerText.replace("₹", ""));
    let discount = (coupon === "DISCOUNT10") ? totalPrice * 0.1 : 0;

    document.getElementById("discount").innerText = "₹" + discount;
    document.getElementById("total-price").innerText = "₹" + (totalPrice - discount);
}

document.getElementById("order-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let selectedFood = Array.from(document.getElementById("food").selectedOptions)
        .map(option => option.text)
        .join(", ");

    let totalPrice = parseFloat(document.getElementById("total-price").innerText.replace("₹", ""));
    let discount = parseFloat(document.getElementById("discount").innerText.replace("₹", "") || 0);

    let orderData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        food: selectedFood,
        quantity: parseInt(document.getElementById("quantity").value),
        total_price: totalPrice,
        discount: discount,
        payment: document.querySelector('input[name="payment"]:checked').value
    };

    fetch("/save-order/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
    .then(response => response.json())
    .then(data => {
        if (orderData.payment === "online") {
            const options = {
                key: "rzp_test_WQUiWvYkt5WmcM",
                amount: data.amount,
                currency: "INR",
                name: "My Restaurant",
                description: "Food Order Payment",
                order_id: data.razorpay_order_id,
                handler: function (response) {
                    let paymentData = {
                        ...orderData,  // 👈 form ke details
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    };
                
                    fetch("/verify-and-save-order/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(paymentData)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            window.location.href = data.redirect;
                        } else {
                            alert("❌ Order save fail after payment.");
                        }
                    })
                    .catch(err => {
                        alert("⚠️ Backend error");
                        console.error(err);
                    });
                },
                
                prefill: {
                    name: orderData.name,
                    contact: orderData.phone
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();  
        } else {
            window.location.href = data.redirect;
        }
    })
    .catch(error => {
        alert("⚠️ Something went wrong.");
        console.error(error);
    });
});


 