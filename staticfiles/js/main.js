// 🌟 Toggle Mobile Menu
function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
    let hamburger = document.querySelector(".hamburger");

    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
}

// 🌟 Slide-in Effect for About Us Section
document.addEventListener("DOMContentLoaded", function () {
    const aboutSection = document.querySelector("#about-us");
    
    function checkScroll() {
        const sectionPos = aboutSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos) {
            aboutSection.classList.add("about-visible");
        }
    }

    window.addEventListener("scroll", checkScroll);
});

// 🌟 Mobile View में Dishes को Slider में बदलें
document.addEventListener("DOMContentLoaded", function () {
    function checkScreenSize() {
        const dishContainer = document.querySelector(".dish-container");
        if (window.innerWidth <= 768) {
            dishContainer.style.overflowX = "scroll";
            dishContainer.style.display = "flex";
            dishContainer.style.whiteSpace = "nowrap";
        } else {
            dishContainer.style.overflowX = "unset";
            dishContainer.style.display = "flex";
        }
    }
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
});


// 🌟 Fade-in Animation for Testimonials Section
document.addEventListener("DOMContentLoaded", function () {
    const testimonials = document.querySelectorAll(".testimonial-card");

    function checkScroll() {
        testimonials.forEach((card) => {
            const sectionPos = card.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;

            if (sectionPos < screenPos) {
                card.classList.add("testimonial-visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);
});




