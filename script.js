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

fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    for (const date in data.events) {
      data.events[date].forEach((event, idx) => {
        let row = document.createElement("tr");

        row.innerHTML = `
          <td>${formatTime(event.unix_timestamp)}</td>
          <td>${event.sport}</td>
          <td>${event.tournament}</td>
          <td>${event.match}</td>
          <td><a class="watch-btn" target="_blank" href="https://arkhan648.github.io/streams/"?id=${event.unix_timestamp}_${idx}">Watch</a></td>
        `;

        matchesBody.appendChild(row);

        // Save channel mapping into localStorage (Optional)
        // Not stored here (only on mystreamplayer.com)
      });
    }
  })
  .catch(err => {
    matchesBody.innerHTML = `<tr><td colspan="5">⚠ Error loading matches</td></tr>`;
    console.error(err);
  });

