import { initClickSystem } from "../systems/clickSystem.js";
import { initEmployees, buyEmployee, upgradeEmployeeSpeed, pauseEmployees, resumeEmployees } from "../systems/employeeSystem.js";
import {
    clickUpgrades,
    employeeSpeedLevels,
    clickMultiplierLevels,
    employeeMultiplierLevels,
    EMPLOYEE_BASE_COST
} from "../systems/upgradeSystem.js";

import { showStats } from "../ui/statsUI.js";
import { showLeaderboardUI } from "../ui/leaderboardUI.js";
import { showSaveUI } from "../ui/saveUI.js";
import { showRouletteUI } from "../ui/rouletteUI.js";

export default class GameScene extends Phaser.Scene {

    create() {

        // ========== GAME CONFIGURATION ==========
        const MIN_EMPLOYEES_FOR_STRIKE = 10;
        const STRIKE_CHANCE = 0.075;
        const STRIKE_TIMER_MS = 60000;
        const SCREEN_WIDTH = this.scale.width;
        const SCREEN_HEIGHT = this.scale.height;
        const CENTER_X = SCREEN_WIDTH / 2;
        const CENTER_Y = SCREEN_HEIGHT / 2;
        const BOTTOM_Y = SCREEN_HEIGHT - 40;

        // ========== GAME STATE ==========
        this.score = 0;
        this.clickIndex = 0;
        this.clickMultiplier = 1;
        this.employeeSpeedIndex = 0;
        this.employeeMultIndex = 0;
        this.employeeMultiplier = employeeMultiplierLevels[0].mult;

        this.strikeActive = false;
        this.strikeClicks = 0;
        this.strikeRequired = 0;
        this.strikeLevel = 0;

        this.gameLocked = false;
        this.cheatBuffer = "";

        // ========== SCORE MANAGEMENT ==========
        this.setScore = (value) => {
            this.score = value;
            if (this.scoreText) {
                this.scoreText.setText(this.score);
            }
            this.checkUnlocks();
        };

        // ========== UI INITIALIZATION ==========
        this.cameras.main.setBackgroundColor("#3a3a3a");

        this.scoreText = this.add.text(CENTER_X, 100, "0", {
            fontSize: "72px",
            color: "#ffff00",
            fontFamily: "Arial",
            stroke: "#000",
            strokeThickness: 6
        }).setOrigin(0.5);

        // ========== GAME SYSTEMS ==========
        initClickSystem(this);
        initEmployees(this);

        // ========== BUTTON FACTORY ==========
        const makeBtn = (x, y, label, color = "#fff", bgColor = 0x2a2a2a, width = 340) => {
            const bg = this.add.rectangle(x, y, width, 64, bgColor, 1)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true });

            const txt = this.add.text(x, y, label, {
                fontSize: "16px",
                color,
                fontFamily: "Arial",
                align: "center"
            }).setOrigin(0.5);

            return {
                bg,
                txt,
                setText: (t) => { txt.setText(t); return this; },
                setVisible: (v) => { bg.setVisible(v); txt.setVisible(v); return this; }
            };
        };

        // ========== UI UPDATE FUNCTIONS ==========
        const updateEmployeeText = () => {
            const cost = Math.round(EMPLOYEE_BASE_COST * Math.pow(1.20, this.employees || 0));
            this.empBtn.setText(`EMPLOYEE\n${cost}c`);
        };

        const updateSpeedText = () => {
            const nextSpeed = employeeSpeedLevels[this.employeeSpeedIndex + 1];
            if (nextSpeed) {
                const cps = (1000 / nextSpeed.delay).toFixed(1);
                this.speedBtn.txt.setText(`UPGRADE EMPLOYEE SPEED\n${cps} c/s\n${nextSpeed.cost}c`);
            } else {
                this.speedBtn.txt.setText("EMPLOYEE SPEED\nMAX");
            }
        };

        const updateEmployeeMultText = () => {
            const next = employeeMultiplierLevels[this.employeeMultIndex + 1];
            if (next) {
                this.empMultBtn.txt.setText(`EMPLOYEE MULT x${next.mult}\n${next.cost}c`);
            } else {
                this.empMultBtn.txt.setText("EMPLOYEE MULT\nMAX");
            }
        };

        const updateClickUpgradeText = () => {
            const next = clickUpgrades[this.clickIndex + 1];
            this.upgradeBtn.setText(next ? `UPGRADE CLICK\n${next.cost}c` : "CLICK MAXED");
        };

        const updateClickMultText = () => {
            const next = clickMultiplierLevels[this.multiplierIndex + 1];
            if (next) {
                this.multBtn.txt.setText(`CLICK MULT x${next.mult}\n${next.cost}c`);
            } else {
                this.multBtn.txt.setText("CLICK MULT\nMAX");
            }
        };

        // ========== MAIN BUTTONS ==========
        this.empBtn = makeBtn(SCREEN_WIDTH - 160, CENTER_Y, "EMPLOYEE\n300c", "#ff6666");
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

        this.upgradeBtn = makeBtn(160, CENTER_Y, "", "#00ff88");
        this.upgradeBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;
            const next = clickUpgrades[this.clickIndex + 1];
            if (!next) return;
            if (this.score >= next.cost) {
                this.setScore(this.score - next.cost);
                this.clickIndex++;
                updateClickUpgradeText();
                this.checkUnlocks();
            }
        });
        updateClickUpgradeText();

        // ========== UPGRADE BUTTONS ==========
        this.speedBtn = makeBtn(SCREEN_WIDTH - 160, CENTER_Y + 110, "UPGRADE EMPLOYEE SPEED");
        this.empMultBtn = makeBtn(SCREEN_WIDTH - 160, CENTER_Y + 220, "EMPLOYEE MULT");
        this.multBtn = makeBtn(160, CENTER_Y + 110, "CLICK MULT");

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

        this.empMultBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;
            const next = employeeMultiplierLevels[this.employeeMultIndex + 1];
            if (!next) return;
            if (this.score >= next.cost) {
                this.score -= next.cost;
                this.employeeMultIndex++;
                this.employeeMultiplier = next.mult;
                this.setScore(this.score);
                updateEmployeeMultText();
                this.checkUnlocks();
            }
        });

        this.multBtn.bg.on("pointerdown", () => {
            if (this.gameLocked) return;
            const next = clickMultiplierLevels[this.multiplierIndex + 1];
            if (!next) return;
            if (this.score >= next.cost) {
                this.score -= next.cost;
                this.multiplierIndex++;
                this.clickMultiplier = next.mult;
                this.setScore(this.score);
                updateClickMultText();
                this.checkUnlocks();
            }
        });

        updateSpeedText();
        updateEmployeeMultText();
        updateClickMultText();

        // ========== BUTTON VISIBILITY CONTROL ==========
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

            if (this.employees >= 5 || this.employeeMultIndex > 0) this.showBtn(this.empMultBtn);
            else this.hideBtn(this.empMultBtn);

            if (this.clickIndex >= 31) this.showBtn(this.multBtn);
            else this.hideBtn(this.multBtn);

            if (this.score >= 1000) this.showBtn(this.rouletteBtn);
            else this.hideBtn(this.rouletteBtn);
        };

        // ========== UI MANAGEMENT BUTTONS ==========
        this.rouletteBtn = makeBtn(CENTER_X + 240, BOTTOM_Y, "ROULETTE", "#ffa500", 0x2a2a2a, 180);
        this.hideBtn(this.rouletteBtn);

        this.saveBtn = makeBtn(120, BOTTOM_Y, "SAVE", "#0f0", 0x2a2a2a, 180);
        this.statsBtn = makeBtn(CENTER_X, BOTTOM_Y, "STATS", "#fff", 0x2a2a2a, 180);
        this.lbBtn = makeBtn(SCREEN_WIDTH - 120, BOTTOM_Y, "LEADERBOARD", "#ff0", 0x2a2a2a, 180);

        this.saveBtn.bg.on("pointerdown", () => {
            pauseEmployees(this);
            showSaveUI(this);
        });
        this.statsBtn.bg.on("pointerdown", () => {
            pauseEmployees(this);
            showStats(this);
        });
        this.rouletteBtn.bg.on("pointerdown", () => {
            pauseEmployees(this);
            showRouletteUI(this);
        });
        this.lbBtn.bg.on("pointerdown", () => {
            pauseEmployees(this);
            showLeaderboardUI(this);
        });

        this.checkUnlocks();

        // ========== STRIKE SYSTEM ==========
        this.startStrike = () => {
            if (this.strikeActive) return;
            this.strikeActive = true;
            this.strikeLevel++;
            const strikeBase = 100;
            this.strikeRequired = Math.min(500, strikeBase * this.strikeLevel);
            this.strikeClicks = 0;

            this.strikeText = this.add.text(
                CENTER_X,
                CENTER_Y - 200,
                `EMPLOYEES ARE ON STRIKE!\n${this.strikeRequired} clicks left to end strike`,
                {
                    fontSize: "26px",
                    color: "#ff4444",
                    align: "center"
                }
            ).setOrigin(0.5);
        };

        this.time.addEvent({
            delay: STRIKE_TIMER_MS,
            loop: true,
            callback: () => {
                if (this.employees >= MIN_EMPLOYEES_FOR_STRIKE && !this.strikeActive) {
                    if (Math.random() < STRIKE_CHANCE) {
                        this.startStrike();
                    }
                }
            }
        });

        // ========== CHEAT CODE SYSTEM ==========
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