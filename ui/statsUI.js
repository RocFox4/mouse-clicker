import { clickUpgrades, employeeSpeedLevels, employeeMultiplierLevels } from "../systems/upgradeSystem.js";
import { resumeEmployees } from "../systems/employeeSystem.js";

let statsOpen = false;

export function showStats(scene) {
    if (statsOpen) return;
    statsOpen = true;

    scene.gameLocked = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    // Get current click upgrade info
    const current = clickUpgrades?.[scene.clickIndex] || clickUpgrades?.[0];
    const clickMin = current.min * (scene.clickMultiplier || 1);
    const clickMax = current.max * (scene.clickMultiplier || 1);

    // Get employee info
    const employees = scene.employees || 0;
    const speed = employeeSpeedLevels?.[scene.employeeSpeedIndex];
    const empDelay = speed?.delay || 2000;
    const empCpsPerEmployee = employees > 0 ? (1000 / empDelay) : 0;
    const empCpsGlobal = employees * empCpsPerEmployee;

    const nextSpeed = employeeSpeedLevels?.[scene.employeeSpeedIndex + 1];
    const nextInfo = nextSpeed
        ? `${(1000 / nextSpeed.delay).toFixed(2)} c/s (cost ${nextSpeed.cost}c)`
        : "MAX";

    const nextEmpMult = employeeMultiplierLevels?.[scene.employeeMultIndex];
    const nextEmpMultInfo = nextEmpMult
        ? `x${nextEmpMult.mult} (cost ${nextEmpMult.cost}c)`
        : "MAX";

    const boxWidth = 560;
    const boxHeight = 350;
    const DEPTH = 1000;

    const box = scene.add.rectangle(cx, cy, boxWidth, boxHeight, 0x000000, 0.9);
    box.setDepth(DEPTH);

    const text = scene.add.text(cx, cy, `
CLICK CURRENT LEVEL ${scene.clickIndex}:
VALUE: ${clickMin} - ${clickMax}
PROBABILITY: ${Math.round(current.chance * 100)}%
CLICK MULTIPLIER: x${scene.clickMultiplier || 1}


EMPLOYEES: ${employees}
EMPLOYEE MULTIPLIER: x${scene.employeeMultiplier || 1}
EMPLOYEE CPS: ${empCpsPerEmployee.toFixed(2)}
GLOBAL CPS: ${empCpsGlobal.toFixed(2)}

`, {
        fontSize: "18px",
        color: "#fff",
        align: "center",
        wordWrap: { width: boxWidth - 40 }
    }).setOrigin(0.5);

    text.setDepth(DEPTH + 1);

    const close = scene.add.text(cx, cy + (boxHeight / 2) - 20, "RETURN", {
        fontSize: "22px",
        color: "#f00"
    }).setOrigin(0.5).setInteractive();

    close.setDepth(DEPTH + 1);

    close.on("pointerdown", () => {
        statsOpen = false;
        box.destroy();
        text.destroy();
        close.destroy();
        scene.gameLocked = false;
        resumeEmployees(scene);
    });
}