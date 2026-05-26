import { clickUpgrades } from "../systems/upgradeSystem.js";
import { resetEmployees } from "../systems/employeeSystem.js";

const API_URL = "https://mouse-clicker-api-hwcaehcxdhejg4e3.spaincentral-01.azurewebsites.net";

export function showSaveUI(scene) {

    scene.gameLocked = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    let inputText = "";

    const bg = scene.add.rectangle(cx, cy, 360, 220, 0x000000, 0.95);

    const title = scene.add.text(cx, cy - 70, "NAME (3 LETTERS)", {
        fontSize: "22px",
        color: "#ffffff"
    }).setOrigin(0.5);

    const text = scene.add.text(cx, cy - 10, "", {
        fontSize: "42px",
        color: "#00ff00"
    }).setOrigin(0.5);

    const saveBtn = scene.add.text(cx + 90, cy + 70, "SAVE", {
        fontSize: "22px",
        color: "#00ff00",
        backgroundColor: "#222",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    const returnBtn = scene.add.text(cx - 90, cy + 70, "RETURN", {
        fontSize: "22px",
        color: "#ff4444",
        backgroundColor: "#222",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    const closeUI = () => {

        bg.destroy();
        title.destroy();
        text.destroy();
        saveBtn.destroy();
        returnBtn.destroy();

        scene.gameLocked = false;
    };

    const keyHandler = (event) => {

        if (event.key === "Backspace") {
            inputText = inputText.slice(0, -1);
        }
        else if (/^[a-zA-Z]$/.test(event.key) && inputText.length < 3) {
            inputText += event.key.toUpperCase();
        }

        text.setText(inputText);
    };

    scene.input.keyboard.on("keydown", keyHandler);

    saveBtn.on("pointerdown", async () => {

        if (!inputText) return;

        try {

            await fetch(`${API_URL}/score`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    playerName: inputText,
                    score: scene.score
                })
            });

        } catch (err) {
            console.error(err);
        }

        // =====================
        // FULL RESET
        // =====================

        scene.score = 0;
        scene.scoreText.setText("0");

        // click upgrades
        scene.clickIndex = 0;

        // multiplier
        scene.multiplierIndex = 0;
        scene.clickMultiplier = 1;

        // employees
        resetEmployees(scene);

        // BUTTONS RESET
        const next = clickUpgrades[1];

        scene.upgradeBtn.setText(
            next
                ? `UPGRADE CLICK\n${next.cost}`
                : "MAX"
        );

        scene.empBtn.setText("EMPLOYEE\n300");

        scene.speedBtn.setVisible(false).disableInteractive();

        scene.multBtn.setVisible(false).disableInteractive();

        // cleanup
        scene.input.keyboard.off("keydown", keyHandler);

        closeUI();
    });

    returnBtn.on("pointerdown", () => {

        scene.input.keyboard.off("keydown", keyHandler);

        closeUI();
    });
}