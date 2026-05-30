import { showFloatingText } from "./floatingText.js";
import { resumeEmployees } from "../systems/employeeSystem.js";

let rouletteOpen = false;

const MIN_BET = 1000;
const PAYOUT_NUMBER = 100;
const PAYOUT_COLOR = 2;

// European wheel sequence starting at 0, clockwise
const WHEEL_NUMBERS = [
    0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26
];

const NUMBER_COLORS = {}; // map number->color
WHEEL_NUMBERS.forEach(n => {
    if (n === 0) NUMBER_COLORS[n] = "green";
    else {
        // known red numbers set
        const reds = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
        NUMBER_COLORS[n] = reds.has(n) ? "red" : "black";
    }
});

export function showRouletteUI(scene) {
    if (rouletteOpen) return;
    if (scene.score < 1000) return;
    rouletteOpen = true;
    
    scene.gameLocked = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;
    const radius = Math.min(scene.scale.width, scene.scale.height) * 0.22;
    const contentYOffset = -20;
    const wheelCenterY = cy + contentYOffset;

    let selectedNumber = null;
    let selectedColor = null; // "red" or "black"
    let bet = MIN_BET;

    const depthBase = 1200;
    const overlay = scene.add.rectangle(cx, cy, scene.scale.width, scene.scale.height, 0x000000, 0.7).setDepth(depthBase);

    const title = scene.add.text(cx, wheelCenterY - radius - 105, "CASINO ROULETTE", {
        fontSize: "28px",
        color: "#ffd700",
        fontFamily: "Arial"
    }).setOrigin(0.5).setDepth(depthBase + 1);

    const info = scene.add.text(cx, wheelCenterY - radius - 65, "Bet by number (click a number) or choose a color", {
        fontSize: "16px",
        color: "#ffffff",
        fontFamily: "Arial"
    }).setOrigin(0.5).setDepth(depthBase + 1);

    // Wheel graphics
    const wheel = scene.add.container(cx, wheelCenterY).setDepth(depthBase + 1);
    const wheelG = scene.add.graphics();
    wheel.add(wheelG);
    const wheelLabels = [];

    const N = WHEEL_NUMBERS.length;
    const sectorAngle = (Math.PI * 2) / N;

    for (let i = 0; i < N; i++) {
        const num = WHEEL_NUMBERS[i];
        const angle = -Math.PI / 2 + i * sectorAngle;
        const nextAngle = angle + sectorAngle;

        const color = NUMBER_COLORS[num] === "red" ? 0xff0000 : (NUMBER_COLORS[num] === "black" ? 0x000000 : 0x007f0e);

        wheelG.fillStyle(color, 1);
        wheelG.slice(0, 0, radius, angle, nextAngle, false);
        wheelG.fillPath();

        // number labels placed slightly inside the rim
        const labelAngle = angle + sectorAngle / 2;
        const lx = Math.cos(labelAngle) * (radius * 0.72);
        const ly = Math.sin(labelAngle) * (radius * 0.72);

        const lbl = scene.add.text(lx, ly, `${num}`, {
            fontSize: "18px",
            color: NUMBER_COLORS[num] === "black" ? "#ffffff" : "#ffffff",
            fontFamily: "Arial"
        }).setOrigin(0.5).setDepth(depthBase + 2);

        lbl.setInteractive({ useHandCursor: true });
        lbl.on("pointerdown", () => {
            if (isSpinning) return;
            if (betPlaced) return;
            selectedNumber = num;
            selectedColor = null;
            updateSelection();
        });

        wheel.add(lbl);
        wheelLabels.push(lbl);
    }

    // center circle
    const center = scene.add.circle(0, 0, radius * 0.28, 0x111111).setDepth(depthBase + 2);
    wheel.add(center);

    // ball
    const ball = scene.add.circle(0, -radius - 12, 8, 0xffffff).setDepth(depthBase + 3);
    wheel.add(ball);

    // UI texts
    const selectedText = scene.add.text(cx, wheelCenterY + radius + 10, `Selected: -`, { fontSize: "20px", color: "#ffffff" }).setOrigin(0.5).setDepth(depthBase + 1);
    const balanceText = scene.add.text(cx, wheelCenterY + radius + 35, `Balance: ${scene.score}`, { fontSize: "18px", color: "#ffffaa" }).setOrigin(0.5).setDepth(depthBase + 1);
    const betText = scene.add.text(cx, wheelCenterY + radius + 125, `Bet: ${bet}`, { fontSize: "20px", color: "#00ff00" }).setOrigin(0.5).setDepth(depthBase + 1);
    const resultText = scene.add.text(cx, wheelCenterY + radius + 155, `Result: -`, { fontSize: "18px", color: "#ffffff" }).setOrigin(0.5).setDepth(depthBase + 1);
    const outcomeText = scene.add.text(cx, wheelCenterY + radius + 180, ``, { fontSize: "18px", color: "#ffffff" }).setOrigin(0.5).setDepth(depthBase + 1);

    const makeBtn = (x, y, label, color = "#fff", bgColor = 0x2a2a2a, w = 140) => {
        const bg = scene.add.rectangle(x, y, w, 40, bgColor, 1).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(depthBase + 1);
        const txt = scene.add.text(x, y, label, { fontSize: "16px", color, fontFamily: "Arial" }).setOrigin(0.5).setDepth(depthBase + 2);
        bg.on("pointerover", () => bg.setFillStyle(0x3a3a3a, 1));
        bg.on("pointerout", () => bg.setFillStyle(bgColor, 1));
        return { bg, txt };
    };

    const placeBtn = makeBtn(cx - 120, wheelCenterY + radius + 210, "PLACE BET", "#fff", 0x444444, 180);
    const spinBtn = makeBtn(cx + 120, wheelCenterY + radius + 210, "SPIN", "#0f0", 0x2a2a2a, 180);
    const minusBtn = makeBtn(cx - 160, wheelCenterY + radius + 125, "-1000");
    const plusBtn = makeBtn(cx + 160, wheelCenterY + radius + 125, "+1000");
    const colorRedBtn = makeBtn(cx - 200, wheelCenterY + radius + 65, "RED", "#fff", 0xff0000, 140);
    const colorGreenBtn = makeBtn(cx, wheelCenterY + radius + 65, "GREEN", "#fff", 0x007f0e, 140);
    const colorBlackBtn = makeBtn(cx + 200, wheelCenterY + radius + 65, "BLACK", "#fff", 0x000000, 140);
    const closeBtn = makeBtn(scene.scale.width - 60, 40, "X", "#ff4444", 0x2a2a2a, 48);

    const updateSelection = () => {
        selectedText.setText(`Selected: ${selectedNumber !== null ? selectedNumber : (selectedColor || "-")}`);

        // highlight color buttons when selected
        try {
            colorRedBtn.bg.setFillStyle(selectedColor === "red" ? 0xff6666 : 0xff0000);
            colorBlackBtn.bg.setFillStyle(selectedColor === "black" ? 0x444444 : 0x000000);
            colorGreenBtn.bg.setFillStyle(selectedColor === "green" ? 0x33cc33 : 0x007f0e);
        } catch (e) {
            // ignore if elements missing during teardown
        }
    };

    const setButtonState = (btn, enabled, fillColor) => {
        if (enabled) btn.bg.setInteractive({ useHandCursor: true });
        else btn.bg.disableInteractive();
        btn.bg.setFillStyle(fillColor);
    };

    let isSpinning = false;
    let betPlaced = false;

    const changeBet = (delta) => {
        if (isSpinning || betPlaced) return;
        const maxBet = Math.floor(scene.score / MIN_BET) * MIN_BET || MIN_BET;
        bet = Math.max(MIN_BET, Math.min(maxBet, (bet + delta)));
        if (bet < MIN_BET) bet = MIN_BET;
        betText.setText(`Bet: ${bet}`);
    };

    minusBtn.bg.on("pointerdown", () => changeBet(-MIN_BET));
    plusBtn.bg.on("pointerdown", () => changeBet(MIN_BET));

    // initial interactivity: spin disabled until bet is placed
    setButtonState(spinBtn, false, 0x222222);

    const setSelectionInteractivity = (enabled) => {
        setButtonState(colorRedBtn, enabled, selectedColor === "red" ? 0xff6666 : 0xff0000);
        setButtonState(colorGreenBtn, enabled, selectedColor === "green" ? 0x33cc33 : 0x007f0e);
        setButtonState(colorBlackBtn, enabled, selectedColor === "black" ? 0x444444 : 0x000000);
        wheelLabels.forEach(lbl => enabled ? lbl.setInteractive({ useHandCursor: true }) : lbl.disableInteractive());
    };

    const disableBetInputs = () => {
        setButtonState(minusBtn, false, 0x222222);
        setButtonState(plusBtn, false, 0x222222);
        setSelectionInteractivity(false);
    };

    const enableBetInputs = () => {
        if (scene.score >= MIN_BET) {
            setButtonState(minusBtn, true, 0x2a2a2a);
            setButtonState(plusBtn, true, 0x2a2a2a);
            setSelectionInteractivity(true);
        }
    };

    // Place bet flow: deduct immediately and enable spin
    placeBtn.bg.on("pointerdown", () => {
        if (isSpinning) return;
        if (!selectedNumber && !selectedColor) return;
        if (!bet || bet < MIN_BET) return;
        if (scene.score < bet) return;

        // deduct and mark placed
        scene.score -= bet;
        scene.scoreText.setText(scene.score);
        balanceText.setText(`Balance: ${scene.score}`);
        showFloatingText(scene, cx, cy + radius + 160, `-${bet}`, "#ff4444");
        betPlaced = true;

        // enable spin, disable bet inputs and place again
        setButtonState(spinBtn, true, 0x2a2a2a);
        setButtonState(placeBtn, false, 0x333333);
        disableBetInputs();
        betText.setColor("#ffff00");
    });

    colorRedBtn.bg.on("pointerdown", () => {
        if (isSpinning || betPlaced) return;
        selectedColor = "red";
        selectedNumber = null;
        updateSelection();
    });
    colorGreenBtn.bg.on("pointerdown", () => {
        if (isSpinning || betPlaced) return;
        selectedColor = "green";
        selectedNumber = null;
        updateSelection();
    });
    colorBlackBtn.bg.on("pointerdown", () => {
        if (isSpinning || betPlaced) return;
        selectedColor = "black";
        selectedNumber = null;
        updateSelection();
    });

    const cleanup = () => {
        rouletteOpen = false;
        scene.rouletteCleanup = null;
        overlay.destroy();
        title.destroy();
        info.destroy();
        wheel.destroy();
        selectedText.destroy();
        balanceText.destroy();
        betText.destroy();
        resultText.destroy();
        outcomeText.destroy();
        spinBtn.bg.destroy(); spinBtn.txt.destroy();
        placeBtn.bg.destroy(); placeBtn.txt.destroy();
        minusBtn.bg.destroy(); minusBtn.txt.destroy();
        plusBtn.bg.destroy(); plusBtn.txt.destroy();
        colorRedBtn.bg.destroy(); colorRedBtn.txt.destroy();
        colorBlackBtn.bg.destroy(); colorBlackBtn.txt.destroy();
        colorGreenBtn.bg.destroy(); colorGreenBtn.txt.destroy();
        closeBtn.bg.destroy(); closeBtn.txt.destroy();
        scene.gameLocked = false;
        resumeEmployees(scene);
    };
    
    scene.rouletteCleanup = cleanup;

    closeBtn.bg.on("pointerdown", () => cleanup());

    const showResultMessage = (text, color = "#00ff00") => {
        const msg = scene.add.text(cx, cy, text, { fontSize: "36px", color, fontFamily: "Arial", stroke: "#000", strokeThickness: 4 }).setOrigin(0.5).setDepth(depthBase + 5);
        scene.tweens.add({ targets: msg, alpha: 0, y: cy - 60, duration: 2000, ease: 'Cubic.easeOut', onComplete: () => msg.destroy() });
    };

    spinBtn.bg.on("pointerdown", () => {
        if (!betPlaced || isSpinning) return;
        isSpinning = true;
        scene.gameLocked = true;
        resultText.setText("Result: -");
        outcomeText.setText("");

        // disable all selection controls while spinning
        setButtonState(placeBtn, false, 0x333333);
        setButtonState(spinBtn, false, 0x222222);
        disableBetInputs();

        // choose random target
        const targetIndex = Phaser.Math.Between(0, N - 1);
        const rotations = Phaser.Math.Between(6, 9);
        const finalAngle = rotations * Math.PI * 2 + (targetIndex * sectorAngle + sectorAngle / 2);

        const obj = { ang: 0 };
        scene.tweens.add({
            targets: obj,
            ang: finalAngle,
            duration: 9000,
            ease: 'Cubic.easeOut',
            onUpdate: () => {
                const ballAngle = -Math.PI / 2 + obj.ang;
                ball.x = Math.cos(ballAngle) * (radius + 12);
                ball.y = Math.sin(ballAngle) * (radius + 12);
            },
            onComplete: () => {
                const resultIndex = targetIndex % N;
                const resultNumber = WHEEL_NUMBERS[resultIndex];
                const resultColor = NUMBER_COLORS[resultNumber];

                resultText.setText(`Result: ${resultNumber} ${resultColor}`);
                let won = false;
                let payout = 0;

                if (selectedNumber !== null && selectedNumber === resultNumber) {
                    won = true;
                    payout = bet * PAYOUT_NUMBER;
                } else if (selectedColor !== null && selectedColor === resultColor) {
                    won = true;
                    payout = bet * PAYOUT_COLOR;
                }

                if (won) {
                    scene.score += payout;
                    outcomeText.setText(`YOU WIN +${payout}`);
                    outcomeText.setColor("#00ff00");
                    showFloatingText(scene, cx, cy + radius + 220, `+${payout}`, "#00ff00");
                } else {
                    outcomeText.setText(`YOU LOSE -${bet}`);
                    outcomeText.setColor("#ff4444");
                }

                scene.scoreText.setText(scene.score);
                balanceText.setText(`Balance: ${scene.score}`);

                selectedNumber = null;
                selectedColor = null;
                updateSelection();
                betPlaced = false;
                isSpinning = false;

                // re-enable controls if balance allows
                if (scene.score >= MIN_BET) {
                    setButtonState(minusBtn, true, 0x2a2a2a);
                    setButtonState(plusBtn, true, 0x2a2a2a);
                    setButtonState(placeBtn, true, 0x444444);
                    setSelectionInteractivity(true);
                }
            }
        });
    });
}

