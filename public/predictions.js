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

    // Prepare data for backend
    const predictionData = {
        username: username,  // matches backend requirement
        values: values
    };

    // Send to Node backend
    fetch("/api/server.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(predictionData)
    })
    .then(res => res.json())
    .then(result => {
        alert(result.message || "Predictions saved successfully!");
        console.log(result);
    })
    .catch(err => {
        console.error("Error saving predictions:", err);
        alert("Something went wrong. Try again.");
    });
});

// Highlight active navigation link
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-link").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
});
