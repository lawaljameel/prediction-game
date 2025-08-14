// predictions.js

// Get stored username
const username = localStorage.getItem("username");

if (!username) {
    // If no username found, redirect to sign-in page
    window.location.href = "index.html";
} else {
    document.getElementById("welcome-msg").textContent = `Welcome, ${username}!`;
}

// Elements for popup info
const infoBtn = document.getElementById("info-btn");
const infoPopup = document.getElementById("info-popup");

// Show popup on button click
infoBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent closing immediately
    infoPopup.style.display = "block";
});

// Hide popup when clicking anywhere else
document.addEventListener("click", () => {
    infoPopup.style.display = "none";
});

// Prevent closing when clicking inside the popup itself
infoPopup.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Custom alert function
function showCustomAlert(message, type = "success") {
    const alertBox = document.getElementById("custom-alert");
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;

    // Remove after 3 seconds
    setTimeout(() => {
        alertBox.className = "alert";
    }, 3000);
}

// Handle form submission
document.getElementById("prediction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Submitting <span class="spinner"></span>`;

    // Collect form values into an array
    const values = [
        document.getElementById("top6").value.trim(),
        document.getElementById("bottom3").value.trim(),
        document.getElementById("firstManager").value.trim(),
        document.getElementById("goldenBoot").value.trim(),
        document.getElementById("playerSeason").value.trim(),
        document.getElementById("uclWinner").value.trim(),
        document.getElementById("faCupWinner").value.trim(),
        document.getElementById("carabaoWinner").value.trim(),
        document.getElementById("europaWinner").value.trim()
    ];

    // Call backend function
    addPrediction(username, values, submitBtn, this);
});

// Function to add prediction
async function addPrediction(username, values, submitBtn, form) {
    try {
        const response = await fetch('/api/server?route=add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                values: values
            })
        });

        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            showCustomAlert(`Error: ${result.message}`, "error");
        } else {
            showCustomAlert("Prediction added successfully!", "success");
            form.reset(); // Clear the form
        }
    } catch (error) {
        console.error('Error adding prediction:', error);
        showCustomAlert("Failed to add prediction.", "error");
    } finally {
        // Re-enable the button
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
    }
}

// Highlight active navigation link
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
