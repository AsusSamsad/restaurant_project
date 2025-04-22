// 🌟 Toggle Mobile Menu
function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
    let hamburger = document.querySelector(".hamburger");

    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

// 🌟 Contact Form Submission (Fake Delay for Animation)
document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Add a Loading Effect (Optional)
    document.querySelector(".submit-btn").textContent = "Sending...";

    setTimeout(() => {
        alert("✅ Message Sent Successfully!");
        document.querySelector(".submit-btn").textContent = "Send Message";
        document.getElementById("contactForm").reset();
    }, 2000);
});
