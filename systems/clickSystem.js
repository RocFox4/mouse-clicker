import { clickUpgrades } from "./upgradeSystem.js";
import { showFloatingText } from "../ui/floatingText.js";
import { showSaveUI } from "../ui/saveUI.js";

export function initClickSystem(scene) {

    if (scene._clickSystemInitialized) return;
    scene._clickSystemInitialized = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    const button = scene.add.circle(cx, cy + 40, 90, 0x00aaff)
        .setInteractive();

    scene.mainClickButton = button;

    scene.add.text(cx, cy + 40, "CLICK", {
        fontSize: "28px",
        color: "#000"
    }).setOrigin(0.5);

    scene.clickTimes = [];
    let lastClickAt = 0;

    const CPS_LIMIT = 10;
    const WINDOW_MS = 1000;

    // =====================
    // FINGER MESSAGE (ONLY CHANGE)
    // =====================
    const showFingerBox = (text, color = "#ff4444") => {

        const box = scene.add.rectangle(cx, cy - 120, 520, 120, 0x000000, 0.85)
            .setDepth(9999);

        const msg = scene.add.text(cx, cy - 120, text, {
            fontSize: "24px",
            color,
            fontFamily: "Arial",
            align: "center",
            wordWrap: { width: 480 }
        }).setOrigin(0.5)
          .setDepth(10000);

        scene.time.delayedCall(3000, () => {
            box.destroy();
            msg.destroy();
        });
    };

    button.on("pointerup", (pointer) => {

        const now = performance.now();

        if (scene.gameLocked) return;
        //vaga
        if (scene.strikeActive) {

        scene.strikeClicks++;

        const remaining = scene.strikeRequired - scene.strikeClicks;

        if (scene.strikeText) {
            scene.strikeText.setText(
                `EMPLOYEES ARE ON STRIKE!\n${remaining} clicks left to end strike`
            );
        }

        showFloatingText(
            scene,
            pointer.worldX,
            pointer.worldY,
            `+1 strike click!`,
            "#ff4444"
        );

    if (scene.strikeClicks >= scene.strikeRequired) {

        scene.strikeActive = false;

        if (scene.strikeText) {
            scene.strikeText.destroy();
            scene.strikeText = null;
        }

        scene.strikeText = scene.add.text(
            cx,
            cy - 200,
            "✔ EMPLOYEES BACK TO WORK!",
            {
                fontSize: "28px",
                color: "#00ff00",
                fontFamily: "Arial",
                align: "center"
            }
        ).setOrigin(0.5);

        scene.time.delayedCall(3000, () => {

            if (scene.strikeText) {
                scene.strikeText.destroy();
                scene.strikeText = null;
            }
        });
    }

}
        // =====================
        // CPS TRACKING
        // =====================
        scene.clickTimes.push(now);

        while (
            scene.clickTimes.length &&
            scene.clickTimes[0] < now - WINDOW_MS
        ) {
            scene.clickTimes.shift();
        }

        const cps = scene.clickTimes.length;

        // =====================
        // FINGER SYSTEM (ONLY UI CHANGED)
        // =====================
        if (cps > CPS_LIMIT) {

            scene.fingers = Math.max(0, (scene.fingers ?? 10) - 1);

            scene.gameLocked = true;

            if (scene.fingers <= 0) {

                showFingerBox(
                    "YOU BROKE ALL YOUR FINGERS\n NOW YOU CANT CLICK.\nGAME OVER.",
                    "#ff4444"
                );

                scene.time.delayedCall(2000, () => {
                    showSaveUI(scene, true);
                });

                return;
            }

            showFingerBox(
                `TOO FAST \nYou broke 1 finger.\n${scene.fingers} fingers left.`,
                "#ff4444"
            );

            setTimeout(() => {
                scene.gameLocked = false;
            }, 1000);

            return;
        }

        // =====================
        // ANTI SPAM
        // =====================
        if (now - lastClickAt < 30) return;
        lastClickAt = now;

        // =====================
        // CLICK LOGIC (UNCHANGED)
        // =====================
        const idx = Math.min(
            Math.max(0, scene.clickIndex || 0),
            clickUpgrades.length - 1
        );

        const u = clickUpgrades[idx];

        const finalAdded =
            (Math.random() < u.chance ? u.max : u.min) *
            (scene.clickMultiplier || 1);

        scene.setScore(scene.score + finalAdded);

        if (typeof scene.checkUnlocks === "function") {
            scene.checkUnlocks();
        }

        // =====================
        // FLOATING TEXT (UNCHANGED)
        // =====================
        const cursorX = pointer.worldX;
        const cursorY = pointer.worldY;

        showFloatingText(scene, cursorX, cursorY, `+${finalAdded}`, "#00ff00");
    });
}