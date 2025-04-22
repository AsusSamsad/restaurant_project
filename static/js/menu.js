
// 🌟 Toggle Mobile Menu
function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
    let hamburger = document.querySelector(".hamburger");

    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

// 🌟 FIXED: Filter Menu Items with Smooth Animation
function filterMenu(category) {
    let items = document.querySelectorAll(".menu-item");
    let tabs = document.querySelectorAll(".tab");

    // Reset सभी Tabs
    tabs.forEach(tab => tab.classList.remove("active"));

    // Active Tab को Highlight करें
    let activeTab = document.querySelector(`[onclick="filterMenu('${category}')"]`);
    if (activeTab) {
        activeTab.classList.add("active");
    }


    // 🔥 Fix: Ensure Proper Category Matching (Hyphenated Classes)
    items.forEach(item => {
        let itemCategory = item.classList[1];  // Class List Ka Second Element Category Name Hai
        if (category === 'all' || itemCategory === category) {
            item.style.display = "flex";
            setTimeout(() => item.classList.add("show"), 100);
        } else {
            item.classList.remove("show");
            setTimeout(() => {
                item.style.display = "none";
            }, 300);
        }
    });
}
   



// 🌟 Add Click Event to All Menu Items
document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", function () {
        let image = this.querySelector("img").src;
        let title = this.querySelector("h3").innerText;
        let description = this.querySelector(".menu-back p").innerText;
        let price = this.querySelector(".price").innerText.replace("₹", "");

        openPopup(image, title, description, price);
    });
});

// 🌟 Fix: Search Bar Functionality
function searchMenu() {
    let input = document.getElementById("search-input").value.toLowerCase();
    let menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        let itemName = item.querySelector("h3").innerText.toLowerCase();
        
        if (itemName.includes(input)) {
            item.style.display = "flex";  // ✅ Show Item
        } else {
            item.style.display = "none";  // ❌ Hide Item
        }
    });
}


function checkout() {
    alert("Redirecting to Checkout Page...");
    window.location.href = "/checkout/"; // ✅ Checkout Page पर Redirect करो
}




