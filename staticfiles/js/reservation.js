
// 🌟 Multi-Step Form Navigation
const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const form = document.getElementById("reservation-form");
let currentStep = 0;

function showStep(step) {
    steps.forEach((s, index) => {
        s.classList.toggle("active", index === step);
    });
}

// 🌟 Validation Function
function validateStep(step) {
    let isValid = true;
    let inputs = steps[step].querySelectorAll("input, select");
    steps[step].querySelectorAll(".error").forEach(error => error.style.display = "none");

    inputs.forEach(input => {
        if (input.hasAttribute("required") && !input.value.trim()) {
            isValid = false;
            let errorMsg = input.nextElementSibling;
            if (errorMsg) errorMsg.style.display = "block";
            input.classList.add("shake");
            setTimeout(() => input.classList.remove("shake"), 500);
        }
    });

    return isValid;
}

// 🌟 Next Button Click Event
nextBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });
});

// 🌟 Previous Button Click Event
prevBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });
});

// 🌟 Show Popup on Submit
document.querySelector(".submit-btn").addEventListener("click", function (e) {
    e.preventDefault();
    if (validateStep(currentStep)) {
        document.getElementById("success-popup").style.display = "block";
    }
});

// 🌟 Close Popup
function closePopup() {
    document.getElementById("success-popup").style.display = "none";
}
