const API_URL = "https://mouse-clicker-api-hwcaehcxdhejg4e3.spaincentral-01.azurewebsites.net";

export function saveScore(name, score) {
    return fetch(`${API_URL}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name, score })
    });
}

export function getLeaderboard() {
    return fetch(`${API_URL}/leaderboard`).then(r => r.json());
}