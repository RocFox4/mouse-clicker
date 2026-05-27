const API_URL = "https://mouse-clicker-api-hwcaehcxdhejg4e3.spaincentral-01.azurewebsites.net";

// -------------------------
// GUARDAR PUNTUACIÓ
// -------------------------

export function saveScore(name, score) {
    return fetch(`${API_URL}/score`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            playerName: name,
            score: score
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("Error saving score");
        return res.json();
    })
    .catch(err => {
        console.error("saveScore error:", err);
    });
}

// -------------------------
// OBTENIR LEADERBOARD
// -------------------------

export function getLeaderboard() {
    return fetch(`${API_URL}/leaderboard`)
        .then(res => {
            if (!res.ok) throw new Error("Error loading leaderboard");
            return res.json();
        })
        .catch(err => {
            console.error("getLeaderboard error:", err);
            return [];
        });
}