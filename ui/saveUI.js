import { clickUpgrades } from "../systems/upgradeSystem.js";
import { resetEmployees, resumeEmployees } from "../systems/employeeSystem.js";

const API_URL = "https://mouse-clicker-api-hwcaehcxdhejg4e3.spaincentral-01.azurewebsites.net";

export function showSaveUI(scene, gameOver = false) {
    scene.gameLocked = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    let inputText = "";

    const bg = scene.add.rectangle(cx, cy, 420, 260, 0x000000, 0.95);
    const title = scene.add.text(cx, cy - 90,
        gameOver ? "GAME OVER - SAVE SCORE" : "NAME (3 LETTERS)",
        {
            fontSize: "22px",
            color: "#ffffff"
        }
    ).setOrigin(0.5);

    const text = scene.add.text(cx, cy - 10, "", {
        fontSize: "54px",
        color: "#00ff00",
        backgroundColor: "#111",
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5);

    const saveBtn = scene.add.text(cx + 100, cy + 90, "SAVE", {
        fontSize: "22px",
        color: "#00ff00",
        backgroundColor: "#222",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    let returnBtn = null;
    let exitBtn = null;

    if (!gameOver) {
        returnBtn = scene.add.text(cx - 100, cy + 90, "RETURN", {
            fontSize: "22px",
            color: "#ff4444",
            backgroundColor: "#222",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
    } else {
        exitBtn = scene.add.text(cx - 100, cy + 90, "EXIT", {
            fontSize: "22px",
            color: "#ff4444",
            backgroundColor: "#222",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive();
    }

    const closeUI = () => {
        bg.destroy();
        title.destroy();
        text.destroy();
        saveBtn.destroy();
        if (returnBtn) returnBtn.destroy();
        if (exitBtn) exitBtn.destroy();
        scene.input.keyboard.off("keydown", keyHandler);
    };

    const showSavedMessage = () => {
        closeUI();

        const savedBg = scene.add.rectangle(cx, cy, 300, 100, 0x000000, 0.95);
        const savedText = scene.add.text(cx, cy, "SCORE SAVED", {
            fontSize: "36px",
            color: "#00ff00",
            fontFamily: "Arial"
        }).setOrigin(0.5);

        scene.time.delayedCall(2000, () => {
            savedBg.destroy();
            savedText.destroy();
            scene.gameLocked = false;
            resumeEmployees(scene);
        });
    };

    const keyHandler = (event) => {
        if (event.key === "Backspace") {
            inputText = inputText.slice(0, -1);
        } else if (/^[a-zA-Z]$/.test(event.key) && inputText.length < 3) {
            inputText += event.key.toUpperCase();
        }

        text.setText(inputText);
    };

    scene.input.keyboard.on("keydown", keyHandler);

    const resetGameState = () => {
        scene.score = 0;
        scene.scoreText.setText("0");

        // Reset finger system
        scene.fingers = 10;
        scene.fingerLock = false;

        // Reset click system
        scene.clickIndex = 0;
        scene.multiplierIndex = 0;
        scene.clickMultiplier = 1;
        scene.clickTimes = [];
        scene.cheatBuffer = "";

        // Reset employee system
        resetEmployees(scene);

        // Reset strike system
        scene.strikeActive = false;
        scene.strikeClicks = 0;
        scene.strikeRequired = 0;
        scene.strikeLevel = 0;
        if (scene.strikeText) {
            scene.strikeText.destroy();
            scene.strikeText = null;
        }

        // Reset UI buttons
        const next = clickUpgrades[1];
        scene.upgradeBtn.setText(next ? `UPGRADE CLICK\n${next.cost}c` : "MAX");
        scene.empBtn.setText("EMPLOYEE\n300c");
        if (scene.empMultBtn) scene.empMultBtn.setVisible(false).disableInteractive();
        if (scene.speedBtn) scene.speedBtn.setVisible(false).disableInteractive();
        if (scene.multBtn) scene.multBtn.setVisible(false).disableInteractive();
        if (scene.rouletteBtn) scene.rouletteBtn.setVisible(false).disableInteractive();
    };

    saveBtn.on("pointerdown", async () => {
        if (!inputText) return;

        try {
            await fetch(`${API_URL}/score`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    playerName: inputText,
                    score: scene.score
                })
            });
        } catch (err) {
            console.error("Error saving score:", err);
        }

        if (!gameOver) {
            resetGameState();
        }

        showSavedMessage();
    });

    if (returnBtn) {
        returnBtn.on("pointerdown", () => {
            scene.input.keyboard.off("keydown", keyHandler);
            closeUI();
            scene.gameLocked = false;
            resumeEmployees(scene);
        });
    }

    if (exitBtn) {
        exitBtn.on("pointerdown", () => {
            resetGameState();
            closeUI();
            showSavedMessage();
        });
    }
}