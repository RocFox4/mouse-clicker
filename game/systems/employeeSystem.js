import { EMPLOYEE_BASE_COST, employeeSpeedLevels } from "./upgradeSystem.js";

export function initEmployees(scene) {
    scene.employees = 0;
    scene.employeeSpeedIndex = 0;
    scene.employeeDelay = 2000;
}

// comprar employee (infinits)
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

// speed upgrade employees
export function upgradeEmployeeSpeed(scene) {

    const lvl = employeeSpeedLevels[scene.employeeSpeedIndex];
    if (!lvl) return;

    if (scene.score >= lvl.cost) {

        scene.score -= lvl.cost;
        scene.employeeSpeedIndex++;

        const next = employeeSpeedLevels[scene.employeeSpeedIndex];
        scene.employeeDelay = next ? next.delay : 100;

        scene.scoreText.setText(scene.score);
    }
}