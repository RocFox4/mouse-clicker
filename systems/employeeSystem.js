import { EMPLOYEE_BASE_COST, employeeSpeedLevels } from "./upgradeSystem.js";

export function initEmployees(scene) {

    scene.employees = 0;

    scene.employeeSpeedIndex = 0;

    scene.employeeDelay = employeeSpeedLevels[0].delay;

    scene.employeeTimer = null;

    startEmployeeLoop(scene);
}

// =====================
// RESET EMPLOYEES
// =====================
export function resetEmployees(scene) {

    scene.employees = 0;

    scene.employeeSpeedIndex = 0;

    scene.employeeDelay = employeeSpeedLevels[0].delay;

    if (scene.employeeTimer) {
        scene.employeeTimer.remove(false);
    }

    startEmployeeLoop(scene);
}

// =====================
// START LOOP
// =====================
function startEmployeeLoop(scene) {

    if (scene.employeeTimer) {
        scene.employeeTimer.remove(false);
    }

    scene.employeeTimer = scene.time.addEvent({
        delay: scene.employeeDelay,
        loop: true,

        callback: () => {

            if (scene.employees <= 0) return;

            for (let i = 0; i < scene.employees; i++) {

                scene.time.delayedCall(i * 120, () => {

                    scene.score += 1;

                    scene.scoreText.setText(scene.score);

                    const cx = scene.scale.width / 2;
                    const cy = scene.scale.height / 2 + 40;

                    const offsetX = Phaser.Math.Between(-70, 70);
                    const offsetY = Phaser.Math.Between(-70, 70);

                    const txt = scene.add.text(
                        cx + offsetX,
                        cy + offsetY,
                        `+1`,
                        {
                            fontSize: "22px",
                            color: "#ff4444"
                        }
                    )
                    .setOrigin(0.5)
                    .setDepth(1000);

                    scene.tweens.add({
                        targets: txt,
                        y: txt.y - 40,
                        alpha: 0,
                        duration: 700,
                        onComplete: () => txt.destroy()
                    });

                });
            }
        }
    });
}

// =====================
// BUY EMPLOYEE
// =====================
export function buyEmployee(scene) {

    const cost = EMPLOYEE_BASE_COST * Math.pow(2, scene.employees);

    if (scene.score >= cost) {

        scene.score -= cost;

        scene.employees++;

        scene.scoreText.setText(scene.score);

        return cost;
    }

    return null;
}

// =====================
// UPGRADE SPEED
// =====================
export function upgradeEmployeeSpeed(scene) {

    const next = employeeSpeedLevels[scene.employeeSpeedIndex + 1];

    if (!next) return;

    if (scene.score >= next.cost) {

        scene.score -= next.cost;

        scene.employeeSpeedIndex++;

        scene.employeeDelay = next.delay;

        scene.scoreText.setText(scene.score);

        startEmployeeLoop(scene);
    }
}