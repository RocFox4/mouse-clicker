import { getLeaderboard } from "../api/api.js";

export function showLeaderboardUI(scene) {

    scene.gameLocked = true;

    let closed = false;

    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;

    const box = scene.add.rectangle(centerX, centerY, 420, 360, 0x000000, 0.9);

    const title = scene.add.text(centerX, centerY - 150, "LEADERBOARD", {
        fontSize: "28px",
        color: "#ffffff"
    }).setOrigin(0.5);

    const loading = scene.add.text(centerX, centerY - 50, "LOADING...", {
        fontSize: "22px",
        color: "#ffff00"
    }).setOrigin(0.5);

    const returnBtn = scene.add.text(centerX, centerY + 150, "RETURN", {
        fontSize: "22px",
        color: "#ff4444",
        backgroundColor: "#222",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    const ui = [box, title, loading, returnBtn];

    getLeaderboard()
        .then(data => {

            if (closed) return;

            loading.destroy();

            const sorted = (data || [])
                .sort((a, b) => b.score - a.score)
                .slice(0, 10);

            if (sorted.length === 0) {
                const emptyText = scene.add.text(centerX, centerY - 50, "NO SCORES", {
                    fontSize: "20px",
                    color: "#ffffff"
                }).setOrigin(0.5);
                ui.push(emptyText);
                return;
            }

            sorted.forEach((item, i) => {

                const row = scene.add.text(
                    centerX,
                    centerY - 100 + i * 25,
                    `${i + 1}. ${item.playerName} - ${item.score}`,
                    {
                        fontSize: "20px",
                        color: "#00ff00"
                    }
                ).setOrigin(0.5);

                ui.push(row);
            });
        })
        .catch(() => {
            if (closed) return;
            loading.setText("ERROR API");
            loading.setColor("#ff0000");
        });

    returnBtn.on("pointerdown", () => {
        closed = true;
        ui.forEach(o => o.destroy());
        scene.gameLocked = false;
    });
}