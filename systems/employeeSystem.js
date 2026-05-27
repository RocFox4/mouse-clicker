import { EMPLOYEE_BASE_COST, employeeSpeedLevels } from "./upgradeSystem.js";
import { showFloatingText } from "../ui/floatingText.js";

export function initEmployees(scene) {
    scene.employees = 0;
    scene.employeeSpeedIndex = 0;
    scene.employeeMultiplier = 1;
    scene.employeeDelay = employeeSpeedLevels[0].delay;
    scene.employeeTimer = null;

    startEmployeeLoop(scene);
}

export function resetEmployees(scene) {
    scene.employees = 0;
    scene.employeeSpeedIndex = 0;
    scene.employeeDelay = employeeSpeedLevels[0].delay;

    if (scene.employeeTimer) {
        scene.employeeTimer.remove(false);
        scene.employeeTimer = null;
    }

    startEmployeeLoop(scene);
}

// =====================
// LOOP PRINCIPAL
// =====================
function startEmployeeLoop(scene) {

    if (!scene || !scene.time) return;

    // KILL HARD (importantíssim)
    if (scene.employeeTimer) {
        scene.employeeTimer.remove(false);
        scene.employeeTimer.destroy?.(); // extra seguretat
        scene.employeeTimer = null;
    }

    const delay = scene.employeeDelay;

    scene.employeeTimer = scene.time.addEvent({
        delay: delay,
        loop: true,

        callback: () => {

            if (!scene || scene.employees <= 0) return;
            if (scene.strikeActive) return;

            const gain = scene.employees * (scene.employeeMultiplier || 1);

            scene.score += gain;

            if (scene.scoreText) {
                scene.scoreText.setText(scene.score);
            }

            const cx = scene.scale.width / 2;
            const cy = scene.scale.height / 2 + 40;

            showFloatingText(
                scene,
                cx + Phaser.Math.Between(-80, 80),
                cy + Phaser.Math.Between(-50, 50),
                `+${gain}`,
                null,
                "employee"
            );
        }
    });
}

// =====================
// BUY EMPLOYEE
// =====================
export function buyEmployee(scene) {

    const cost = Math.round(
        EMPLOYEE_BASE_COST * Math.pow(1.20, scene.employees)
    );

    if (scene.score >= cost) {
        scene.score -= cost;
        scene.employees++;

        if (scene.scoreText && scene.scoreText.setText) {
            scene.scoreText.setText(scene.score);
        }

        return cost;
    }

    return null;
}

// =====================
// UPGRADE SPEED
// =====================
export function upgradeEmployeeSpeed(scene) {

    const next = employeeSpeedLevels?.[scene.employeeSpeedIndex + 1];
    if (!next) return;

    if (scene.score >= next.cost) {

        scene.score -= next.cost;
        scene.employeeSpeedIndex++;
        scene.employeeDelay = next.delay;

        if (scene.scoreText && scene.scoreText.setText) {
            scene.scoreText.setText(scene.score);
        }

        startEmployeeLoop(scene);
    }
}

export function upgradeEmployeeMultiplier(scene) {

    const next = employeeMultiplierLevels?.[scene.employeeMultIndex + 1];
    if (!next) return false;

    if (scene.score >= next.cost) {

        scene.score -= next.cost;
        scene.employeeMultIndex++;

        scene.employeeMultiplier = next.mult;

        if (scene.scoreText) {
            scene.scoreText.setText(scene.score);
        }

        return true;
    }

    return false;
}