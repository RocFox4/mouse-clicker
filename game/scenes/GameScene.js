import { initClickSystem } from "../systems/clickSystem.js";
import { initEmployees, buyEmployee, upgradeEmployeeSpeed } from "../systems/employeeSystem.js";
import { clickUpgrades, employeeSpeedLevels, clickMultiplierLevels } from "../systems/upgradeSystem.js";

import { showStats } from "../ui/statsUI.js";
import { showLeaderboardUI } from "../ui/leaderboardUI.js";
import { showSaveUI } from "../ui/saveUI.js";

export default class GameScene extends Phaser.Scene {

    create() {

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        const SIDE_BUTTON_WIDTH = 170;
        const BUTTON_HEIGHT = 64;
        const LEFT_BUTTON_MARGIN = 120;
        const RIGHT_BUTTON_MARGIN = 120;

        const makeBtn = (x, y, label, txtStyle = {}) => {
            const bg = this.add.rectangle(x, y, SIDE_BUTTON_WIDTH, BUTTON_HEIGHT, 0x000000, 1).setOrigin(0.5);
            const txt = this.add.text(x, y, label, Object.assign({
                fontSize: "18px",
                color: "#fff",
                align: "center"
            }, txtStyle)).setOrigin(0.5);

            bg.setInteractive({ useHandCursor: true });

            const obj = {
                bg, txt,
                visible: true,
                setText(s) { txt.setText(s); return this; },
                setVisible(v) { bg.setVisible(v); txt.setVisible(v); this.visible = v; return this; },
                setInteractive() { bg.setInteractive(); return this; },
                disableInteractive() { bg.disableInteractive(); return this; },
                getBounds() { return bg.getBounds(); },
                destroy() { bg.destroy(); txt.destroy(); }
            };

            bg.on('pointerdown', (p) => {
                if (obj.onPointer) obj.onPointer(p);
            });

            bg.on('pointerup', (p) => {
                if (obj.onPointerUp) obj.onPointerUp(p);
            });

            return obj;
        };

        // =====================
        // STATE
        // =====================
        this.score = 0;

        this.clickIndex = 0;
        this.clickMultiplier = 1;
        this.multiplierIndex = 0;

        this.employees = 0;
        this.employeeSpeedIndex = 0;
        this.employeeDelay = 2000;

        // =====================
        // SCORE
        // =====================
        this.scoreText = this.add.text(cx, 100, "0", {
            fontSize: "70px",
            color: "#ffff00"
        }).setOrigin(0.5);

        // =====================
        // COMMANDS
        // =====================
        this.commandBuffer = "";
        this.commandText = this.add.text(10, 10, "", {
            fontSize: "16px",
            color: "#fff",
            backgroundColor: "#000",
            padding: { x: 6, y: 4 }
        }).setDepth(1100).setVisible(false);

        this.handleCommand = (cmd) => {
            if ((cmd || "").toLowerCase().trim() === "ad1m") {
                this.score += 100000;
                this.scoreText.setText(this.score);
                return;
            }
        };

        this.input.keyboard.on('keydown', (event) => {

            if (event.key === 'Enter') {
                const cmd = this.commandBuffer.trim();
                if (cmd) this.handleCommand(cmd);
                this.commandBuffer = "";
                this.commandText.setText("");
                return;
            }

            if (event.key === 'Backspace') {
                this.commandBuffer = this.commandBuffer.slice(0, -1);
            } else if (event.key.length === 1) {
                this.commandBuffer += event.key;
            }
        });

        // =====================
        // SYSTEMS
        // =====================
        initClickSystem(this);
        initEmployees(this);

        // =====================
        // EMPLOYEE BUTTON
        // =====================
        this.empBtn = makeBtn(this.scale.width - RIGHT_BUTTON_MARGIN, cy, "EMPLOYEE\n300", { color: "#f44" });

        this.empBtn.onPointer = () => {
            if (this.gameLocked) return;

            const cost = buyEmployee(this);

            if (cost) {
                this.empBtn.setText(`EMPLOYEE\n${300 * Math.pow(2, this.employees)}`);
            }
        };

        // =====================
        // SPEED BUTTON
        // =====================
        this.speedBtn = makeBtn(this.scale.width - RIGHT_BUTTON_MARGIN, cy + 120, "Upgrade employee speed\n-", {
            fontSize: "16px"
        });

        this.speedBtn.setVisible(false).disableInteractive();

        this.speedBtn.onPointer = () => {
            if (this.gameLocked) return;
            upgradeEmployeeSpeed(this);
        };

        // =====================
        // CLICK UPGRADE BUTTON (NEXT LOGIC)
        // =====================
        this.upgradeBtn = makeBtn(LEFT_BUTTON_MARGIN, cy, "", {
            color: "#0f0"
        });

        const updateUpgradeText = () => {
            const next = clickUpgrades[this.clickIndex + 1];
            this.upgradeBtn.setText(
                next ? `UPGRADE CLICK\n${next.cost}` : `CLICK MAXED`
            );
        };

        updateUpgradeText();

        this.upgradeBtn.onPointer = () => {

            if (this.gameLocked) return;

            const next = clickUpgrades[this.clickIndex + 1];
            if (!next) return;

            if (this.score >= next.cost) {
                this.score -= next.cost;
                this.clickIndex++;

                updateUpgradeText();
                this.scoreText.setText(this.score);
            }
        };

        // =====================
        // CLICK MULTIPLIER BUTTON
        // =====================
        this.multBtn = makeBtn(LEFT_BUTTON_MARGIN, cy + 120, "", {
            color: "#ff0"
        });

        this.multBtn.setVisible(false).disableInteractive();

        this.multBtn.onPointer = () => {

            const lvl = clickMultiplierLevels[this.multiplierIndex];
            if (!lvl) return;

            if (this.score >= lvl.cost) {
                this.score -= lvl.cost;
                this.multiplierIndex++;
                this.clickMultiplier = lvl.mult;
                this.scoreText.setText(this.score);
            }
        };

        // =====================
        // STATS / SAVE / LEADERBOARD
        // =====================
        this.add.text(cx, 560, "STATS", {
            fontSize: "22px",
            color: "#fff",
            backgroundColor: "#000",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive().on("pointerdown", () => {
            if (!this.gameLocked) showStats(this);
        });

        this.add.text(90, this.scale.height - 20, "SAVE", {
            fontSize: "16px",
            color: "#0f0",
            backgroundColor: "#000",
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setInteractive().on("pointerdown", () => {
            if (!this.gameLocked) showSaveUI(this);
        });

        this.add.text(this.scale.width - 90, this.scale.height - 20, "LEADERBOARD", {
            fontSize: "16px",
            color: "#ff0",
            backgroundColor: "#000",
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setInteractive().on("pointerdown", () => {
            if (!this.gameLocked) showLeaderboardUI(this);
        });

        // =====================
        // UPDATE LOOP
        // =====================
        this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {

                const maxClick = this.clickIndex >= clickUpgrades.length - 1;

                if (maxClick) {
                    const lvl = clickMultiplierLevels[this.multiplierIndex];

                    if (lvl) {
                        this.multBtn.setVisible(true).setInteractive();
                        this.multBtn.setText(`CLICK x${lvl.mult}\n${lvl.cost}`);
                    } else {
                        this.multBtn.setText(`MAX MULT`);
                    }
                } else {
                    this.multBtn.setVisible(false).disableInteractive();
                }

                // SPEED BUTTON
                if (this.employees > 0) {
                    this.speedBtn.setVisible(true).setInteractive();

                    const nextLvl = employeeSpeedLevels[this.employeeSpeedIndex + 1];
                    const txt = nextLvl
                        ? `${(1000 / nextLvl.delay).toFixed(2)}c/s - ${nextLvl.cost}`
                        : "MAX";

                    this.speedBtn.setText(`Upgrade employee speed\n${txt}`);
                } else {
                    this.speedBtn.setVisible(false).disableInteractive();
                }
            }
        });

        this.employeeTimer = null;
    }
}