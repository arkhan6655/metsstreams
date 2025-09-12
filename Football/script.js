const apiURL = "https://topembed.pw/api.php?format=json";
const matchesBody = document.getElementById("matches-body");

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

// Keyword filter
const keyword = "Football";

// Current timestamp in seconds
const now = Math.floor(Date.now() / 1000);
// 5 hours in seconds
const fiveHours = 5 * 60 * 60;

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    let count = 0;
    for (const date in data.events) {
      data.events[date].forEach((event, idx) => {
        // Skip matches that started more than 5 hours ago
        if (event.unix_timestamp < now - fiveHours) {
          return;
        }

        // Check if keyword matches sport or tournament (case-insensitive)
        if (
          (event.sport && event.sport.toLowerCase() === keyword.toLowerCase()) ||
          (event.tournament && event.tournament.toLowerCase() === keyword.toLowerCase())
        ) {
          let row = document.createElement("tr");

          row.innerHTML = `
            <td>${formatTime(event.unix_timestamp)}</td>
            <td>${event.sport}</td>
            <td>${event.tournament}</td>
            <td>${event.match}</td>
            <td>
              <a class="watch-btn" target="_blank" 
                 href="https://arkhan648.github.io/streams/?id=${event.unix_timestamp}_${idx}">
                 Watch
              </a>
            </td>
          `;

          matchesBody.appendChild(row);
          count++;
        }
      });
    }

    if(count === 0){
      matchesBody.innerHTML = `<tr><td colspan="5">⚠ No Football matches available.</td></tr>`;
    }
  })
  .catch(err => {
    matchesBody.innerHTML = `<tr><td colspan="5">⚠ Error loading matches</td></tr>`;
    console.error(err);
  });
