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

document.addEventListener("DOMContentLoaded", function () {
    const leaderboardTable = document.getElementById("leaderboard-body");

    fetch("/api/server?route=data")
        .then(response => response.json())
        .then(data => {
            let rows = data.data || []; // backend returns { data: [...] }

            rows = rows.slice(1);
        
            leaderboardTable.innerHTML = "";

            rows.forEach((row, index) => {
                let tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row[0] || ""}</td>   <!-- username -->
                    <td>${row[1] || ""}</td>   <!-- top6 -->
                    <td>${row[2] || ""}</td>   <!-- bottom3 -->
                    <td>${row[3] || ""}</td>   <!-- firstManager -->
                    <td>${row[4] || ""}</td>   <!-- goldenBoot -->
                    <td>${row[5] || ""}</td>   <!-- playerSeason -->
                    <td>${row[6] || ""}</td>   <!-- uclWinner -->
                    <td>${row[7] || ""}</td>   <!-- faCupWinner -->
                    <td>${row[8] || ""}</td>   <!-- carabaoWinner -->
                    <td>${row[9] || ""}</td>   <!-- europaWinner -->
                `;

                leaderboardTable.appendChild(tr);
            });
        })
        .catch(error => {
            console.error("Error fetching leaderboard:", error);
            leaderboardTable.innerHTML = "<tr><td colspan='11'>Failed to load leaderboard.</td></tr>";
        });
});

// Highlight current page in nav
const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});