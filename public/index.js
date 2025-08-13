// index.js

const signInBtn = document.getElementById("sign-in-btn");
const usernameInput = document.getElementById("username");

// Sanitize input to prevent HTML injection
function sanitizeInput(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Handle sign-in button click
signInBtn.addEventListener("click", function () {
    let username = usernameInput.value.trim();

    if (!username) {
        alert("Please enter your name to continue.");
        return;
    }

    if (username.length > 20) {
        alert("Name is too long. Max 20 characters.");
        return;
    }

    username = sanitizeInput(username);

    // Save the username to localStorage for predictions page
    localStorage.setItem("username", username);

    // Redirect to predictions page
    window.location.href = "predictions.html";
});

// Allow pressing Enter to submit
usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        signInBtn.click();
    }
});
