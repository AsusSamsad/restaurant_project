// 🌟 Auto-Sliding for Why Choose Us Section
let currentIndex = 0;
const featureBoxes = document.querySelectorAll(".feature-box");

function autoSlide() {
    featureBoxes.forEach((box, index) => {
        box.style.display = "none"; // Hide all features
    });

    featureBoxes[currentIndex].style.display = "block"; // Show only one at a time
    currentIndex = (currentIndex + 1) % featureBoxes.length; // Move to the next
}

// Auto Slide Every 3 Seconds
setInterval(autoSlide, 3000);
