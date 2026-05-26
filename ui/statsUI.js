import { clickUpgrades, employeeSpeedLevels, employeeMultiplierLevels } from "../systems/upgradeSystem.js";

export function showStats(scene) {

    scene.gameLocked = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    // =====================
    // CURRENT CLICK (REAL STATE)
    // =====================
    const current = clickUpgrades?.[scene.clickIndex]
        || clickUpgrades?.[0];

    // CLICK VALUES (REAL, NOT NEXT)
    const clickMin = current.min * (scene.clickMultiplier || 1);
    const clickMax = current.max * (scene.clickMultiplier || 1);

    // =====================
    // EMPLOYEES
    // =====================
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

    // =====================
    // BOX
    // =====================
    const boxWidth = 560;
    const boxHeight = 300;
    const DEPTH = 1000;

    const box = scene.add.rectangle(cx, cy, boxWidth, boxHeight, 0x000000, 0.9);
    box.setDepth(DEPTH);

    // =====================
    // TEXT
    // =====================
    const text = scene.add.text(cx, cy, `
CLICK CURRENT LEVEL:
VALUE: ${clickMin} - ${clickMax}
PROBABILITY: ${Math.round(current.chance * 100)}%

MULTIPLIER: x${scene.clickMultiplier || 1}

LEVEL: ${scene.clickIndex}

EMPLOYEES: ${employees}
EMPLOYEE MULT: x${scene.employeeMultiplier || 1}
EMPLOYEE CPS: ${empCpsPerEmployee.toFixed(2)}
GLOBAL CPS: ${empCpsGlobal.toFixed(2)}

NEXT EMP MULT: ${nextEmpMultInfo}
NEXT SPEED: ${nextInfo}
SPEED LEVEL: ${scene.employeeSpeedIndex}
`, {
        fontSize: "18px",
        color: "#fff",
        align: "center",
        wordWrap: { width: boxWidth - 40 }
    }).setOrigin(0.5);

    text.setDepth(DEPTH + 1);

    // =====================
    // CLOSE
    // =====================
    const close = scene.add.text(cx, cy + (boxHeight / 2) - 20, "RETURN", {
        fontSize: "22px",
        color: "#f00"
    }).setOrigin(0.5).setInteractive();

    close.setDepth(DEPTH + 1);

    close.on("pointerdown", () => {
        box.destroy();
        text.destroy();
        close.destroy();
        scene.gameLocked = false;
    });
}