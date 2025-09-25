const apiURL = "https://topembed.pw/api.php?format=json";
const matchesBody = document.getElementById("matches-body");
const matchesTable = document.getElementById("matches-table");
const loadingDiv = document.getElementById("loading");

// Keyword filter
const keyword = "AFL"; // Change as needed
const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
const cutoff = 6 * 60 * 60; // 6 hours

// Show loader initially
loadingDiv.style.display = "block";
matchesTable.style.display = "none";

function formatTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    let count = 0;

    for (const date in data.events) {
      data.events[date].forEach((event, idx) => {
        // Keyword filter (case-insensitive)
        const keywordMatch =
          (event.sport && event.sport.toLowerCase().includes(keyword.toLowerCase())) ||
          (event.tournament && event.tournament.toLowerCase().includes(keyword.toLowerCase()));

        // Time filter: show upcoming or started within last 6 hours
        const timeMatch = event.unix_timestamp + cutoff > now;

        if (keywordMatch && timeMatch) {
          const row = document.createElement("tr");

          // Create unique ID for countdown
          const timerId = `timer-${event.unix_timestamp}-${idx}`;
          const link = `https://arkhan648.github.io/streams/?id=${event.unix_timestamp}_${idx}`;

          row.innerHTML = `
            <td>${formatTime(event.unix_timestamp)}</td>
            <td>${event.sport || "-"}</td>
            <td>${event.tournament || "-"}</td>
            <td>${event.match || "-"}</td>
            <td>
              <span class="countdown" id="${timerId}">Watch in 10s</span>
            </td>
          `;

          matchesBody.appendChild(row);
          count++;

          // Start countdown for this row
          let seconds = 10;
          const countdownEl = document.getElementById(timerId);
          const interval = setInterval(() => {
            seconds--;
            if (seconds > 0) {
              countdownEl.textContent = `Watch in ${seconds}s`;
            } else {
              clearInterval(interval);
              countdownEl.outerHTML = `
                <a class="watch-btn" target="_blank" href="${link}">Watch</a>
              `;
            }
          }, 1000);
        }
      });
    }

    // Hide loader and show table
    loadingDiv.style.display = "none";
    matchesTable.style.display = count > 0 ? "table" : "none";

    if (count === 0) {
      matchesBody.innerHTML = `<tr><td colspan="5">⚠ No matches available.</td></tr>`;
      matchesTable.style.display = "table";
    }
  })
  .catch(err => {
    loadingDiv.innerHTML = `<p style="color:red;">⚠ Error loading matches</p>`;
    console.error(err);
  });
