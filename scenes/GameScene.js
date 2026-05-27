import { initClickSystem } from "../systems/clickSystem.js";
import { initEmployees, buyEmployee, upgradeEmployeeSpeed } from "../systems/employeeSystem.js";
import { clickUpgrades, employeeSpeedLevels, clickMultiplierLevels, employeeMultiplierLevels, EMPLOYEE_BASE_COST } from "../systems/upgradeSystem.js";

import { showStats } from "../ui/statsUI.js";
import { showLeaderboardUI } from "../ui/leaderboardUI.js";
import { showSaveUI } from "../ui/saveUI.js";
import { showRouletteUI } from "../ui/rouletteUI.js";

export default class GameScene extends Phaser.Scene {

    create() {

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const bottomY = this.scale.height - 40;

        // =====================
        // STATE
        // =====================
        this.score = 0;

        this.clickIndex = 0;
        this.multiplierIndex = 0;
        this.employeeSpeedIndex = 0;
        this.employeeMultIndex = 0;

        this.clickMultiplier = 1;
        this.employeeMultiplier = 1;
        this.gameLocked = false;
        this.cheatBuffer = "";

        // IMPORTANT
        this.setScore = (value) => {
            this.score = value;
            this.scoreText.setText(this.score);
            this.checkUnlocks();
        };

        // =====================
        // BACKGROUND
        // =====================
        this.cameras.main.setBackgroundColor("#3a3a3a");

        // =====================
        // SCORE
        // =====================
        this.scoreText = this.add.text(cx, 100, "0", {
            fontSize: "72px",
            color: "#ffff00",
            fontFamily: "Arial",
            stroke: "#000",
            strokeThickness: 6
        }).setOrigin(0.5);

        // =====================
        // SYSTEMS
        // =====================
        initClickSystem(this);
        initEmployees(this);

        // =====================
        // BUTTON FACTORY
        // =====================
        const BTN_W = 340;
        const BTN_H = 64;

        const makeBtn = (x, y, label, color = "#fff", bgColor = 0x2a2a2a, width = BTN_W) => {

            const bg = this.add.rectangle(x, y, width, BTN_H, bgColor, 1)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const txt = this.add.text(x, y, label, {
                fontSize: "16px",
                color,
                fontFamily: "Arial",
                align: "center"
            }).setOrigin(0.5);

            const btn = {
                bg,
                txt,
                setText: (t) => { txt.setText(t); return btn; },
                setVisible: (v) => { bg.setVisible(v); txt.setVisible(v); return btn; }
            };

            return btn;
        };

        // =====================
        // UPDATE TEXTS
        // =====================

        const updateEmployeeText = () => {
            const cost = Math.round(EMPLOYEE_BASE_COST * Math.pow(1.20, this.employees || 0));
            this.empBtn.setText(`EMPLOYEE\n${cost}c`);
        };

        const updateSpeedText = () => {
            const nextSpeed = employeeSpeedLevels[this.employeeSpeedIndex + 1];

            if (nextSpeed) {
                const cps = (1000 / nextSpeed.delay).toFixed(1);

                this.speedBtn.txt.setText(
                    `UPGRADE EMPLOYEE SPEED\n${cps} c/s\n${nextSpeed.cost}c`
                );
            } else {
                this.speedBtn.txt.setText("EMPLOYEE SPEED\nMAX");
            }
        };

        const updateEmployeeMultText = () => {
            const nextEmp = employeeMultiplierLevels[this.employeeMultIndex];
            if (nextEmp) {
                this.empMultBtn.setText(`EMPLOYEE MULT x${nextEmp.mult}\n${nextEmp.cost}c`);
            } else {
                this.empMultBtn.setText("EMPLOYEE MULT\nMAX");
            }
        };

        // =====================
        // EMPLOYEE BUTTON
        // =====================
        this.empBtn = makeBtn(this.scale.width - 160, cy, "EMPLOYEE\n300c", "#ff6666");

        this.empBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;

            const cost = buyEmployee(this);

            if (cost !== null) {
                this.setScore(this.score);
                updateEmployeeText();
                this.checkUnlocks();
            }
        });

        updateEmployeeText();

        // =====================
        // CLICK UPGRADE
        // =====================
        this.upgradeBtn = makeBtn(160, cy, "", "#00ff88");

        const updateUpgradeText = () => {
            const next = clickUpgrades[this.clickIndex + 1];
            this.upgradeBtn.setText(next ? `UPGRADE CLICK\n${next.cost}c` : "CLICK MAXED");
        };

        this.upgradeBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;

            const next = clickUpgrades[this.clickIndex + 1];
            if (!next) return;

            if (this.score >= next.cost) {
                this.setScore(this.score - next.cost);
                this.clickIndex++;
                updateUpgradeText();
                this.checkUnlocks();
            }
        });

        updateUpgradeText();

        // =====================
        // SPEED + MULT
        // =====================
        this.speedBtn = makeBtn(this.scale.width - 160, cy + 110, "UPGRADE EMPLOYEE SPEED");
        this.empMultBtn = makeBtn(this.scale.width - 160, cy + 220, "EMPLOYEE MULT");
        this.multBtn = makeBtn(160, cy + 110, "CLICKMULT");

        // 🔥🔥🔥 BOTÓ DE SPEED ARREGLAT 🔥🔥🔥
        this.speedBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;

            const next = employeeSpeedLevels[this.employeeSpeedIndex + 1];
            if (!next) return;

            if (this.score >= next.cost) {
                upgradeEmployeeSpeed(this);
                updateSpeedText();
                this.checkUnlocks();
            }
        });

        updateSpeedText();
        updateEmployeeMultText();

        // =====================
        // UNLOCK SYSTEM
        // =====================
        this.hideBtn = (btn) => {
            btn.bg.setVisible(false);
            btn.txt.setVisible(false);
            btn.bg.disableInteractive();
        };

        this.showBtn = (btn) => {
            btn.bg.setVisible(true);
            btn.txt.setVisible(true);
            btn.bg.setInteractive({ useHandCursor: true });
        };

        this.checkUnlocks = () => {

            if (this.employees > 0) this.showBtn(this.speedBtn);
            else this.hideBtn(this.speedBtn);

            if (this.employees >= 5) this.showBtn(this.empMultBtn);
            else this.hideBtn(this.empMultBtn);

            if (this.clickIndex >= 31) this.showBtn(this.multBtn);
            else this.hideBtn(this.multBtn);

            if (this.score >= 1000) this.showBtn(this.rouletteBtn);
            else this.hideBtn(this.rouletteBtn);
        };

        // =====================
        // ROULETTE + UI
        // =====================
        this.rouletteBtn = makeBtn(cx + 240, bottomY, "ROULETTE", "#ffa500", 0x2a2a2a, 180);
        this.hideBtn(this.rouletteBtn);

        this.saveBtn = makeBtn(120, bottomY, "SAVE", "#0f0", 0x2a2a2a, 180);
        this.statsBtn = makeBtn(cx, bottomY, "STATS", "#fff", 0x2a2a2a, 180);
        this.lbBtn = makeBtn(this.scale.width - 120, bottomY, "LEADERBOARD", "#ff0", 0x2a2a2a, 180);

        this.saveBtn.bg.on("pointerdown", () => showSaveUI(this));
        this.statsBtn.bg.on("pointerdown", () => showStats(this));
        this.rouletteBtn.bg.on("pointerdown", () => showRouletteUI(this));
        this.lbBtn.bg.on("pointerdown", () => showLeaderboardUI(this));

        this.checkUnlocks();

        // =====================
        // CHEAT (NO TOCAT)
        // =====================
        this.input.keyboard.on("keydown", (event) => {

            if (this.gameLocked) return;

            if (event.key === "Enter") {
                if (this.cheatBuffer.toLowerCase() === "ad1m") {
                    this.setScore(this.score + 1000000);
                }
                this.cheatBuffer = "";
                return;
            }

            if (event.key.length === 1) {
                this.cheatBuffer += event.key;
                if (this.cheatBuffer.length > 10) {
                    this.cheatBuffer = this.cheatBuffer.slice(-10);
                }
            }
        });
    }
}
