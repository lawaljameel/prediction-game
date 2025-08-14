// predictions.js

// Get stored username
const username = localStorage.getItem("username");

if (!username) {
    // If no username found, redirect to sign-in page
    window.location.href = "index.html";
} else {
    document.getElementById("welcome-msg").textContent = `Welcome, ${username}!`;
}

// Handle form submission
document.getElementById("prediction-form").addEventListener("submit", function (e) {
    e.preventDefault();

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
    addPrediction(username, values);
});

// Function to add prediction
async function addPrediction(username, values) {
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
            alert(`Error: ${result.message}`);
        } else {
            alert('Prediction added successfully!');
        }
    } catch (error) {
        console.error('Error adding prediction:', error);
        alert('Failed to add prediction.');
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
