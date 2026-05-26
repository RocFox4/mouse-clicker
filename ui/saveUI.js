import { saveScore } from "../api/api.js";

export function showSaveUI(scene) {

    scene.gameLocked = true;

    let input = "";

    const box = scene.add.rectangle(400, 300, 360, 200, 0x000000, 0.85);

    const text = scene.add.text(400, 280, "", {
        fontSize: "40px",
        color: "#00ff00"
    }).setOrigin(0.5);

    const saveBtn = scene.add.text(480, 340, "SAVE", {
        fontSize: "22px",
        color: "#0f0"
    }).setInteractive().setOrigin(0.5);

    const returnBtn = scene.add.text(320, 340, "RETURN", {
        fontSize: "22px",
        color: "#f00"
    }).setInteractive().setOrigin(0.5);

    const ui = [box, text, saveBtn, returnBtn];

    scene.input.keyboard.removeAllListeners();

    scene.input.keyboard.on("keydown", (e) => {

        if (!scene.gameLocked) return;

        if (e.key === "Backspace") input = input.slice(0, -1);
        else if (/^[a-zA-Z]$/.test(e.key) && input.length < 3)
            input += e.key.toUpperCase();

        text.setText(input);
    });

    saveBtn.on("pointerdown", () => {
        if (!input) return;

        saveBtn.disableInteractive();
        returnBtn.disableInteractive();

        saveScore(input, scene.score)
            .catch(() => {
                // Silently continue if the save fails, but still close the UI.
            })
            .finally(() => {
                scene.score = 0;
                scene.scoreText.setText("0");

                scene.clickIndex = 0;
                scene.employees = 0;
                scene.employeeSpeedIndex = 0;
                scene.employeeDelay = 2000;

                ui.forEach(o => o.destroy());
                scene.gameLocked = false;
            });
    });

    returnBtn.on("pointerdown", () => {
        ui.forEach(o => o.destroy());
        scene.gameLocked = false;
    });
}