import { clickUpgrades } from "./upgradeSystem.js";
import { showFloatingText } from "../ui/floatingText.js";
import { showSaveUI } from "../ui/saveUI.js";

export function initClickSystem(scene) {

    if (scene._clickSystemInitialized) return;
    scene._clickSystemInitialized = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    const button = scene.add.circle(cx, cy + 40, 90, 0x00aaff)
        .setInteractive(); // ❗ NO useHandCursor

    scene.mainClickButton = button;

    scene.add.text(cx, cy + 40, "CLICK", {
        fontSize: "28px",
        color: "#000"
    }).setOrigin(0.5);

    scene.clickTimes = [];
    let lastClickAt = 0;

    const CPS_LIMIT = 10;
    const WINDOW_MS = 1000;

    button.on("pointerup", (pointer) => {

        const now = performance.now();

        if (scene.gameLocked) return;

        // CPS tracking
        scene.clickTimes.push(now);

        while (scene.clickTimes.length &&
            scene.clickTimes[0] < now - WINDOW_MS) {
            scene.clickTimes.shift();
        }

        const cps = scene.clickTimes.length;

        // finger system
        if (cps > CPS_LIMIT) {

            scene.fingers = Math.max(0, (scene.fingers ?? 10) - 1);
            scene.gameLocked = true;

            if (scene.fingers <= 0) {
                const msg = scene.add.text(cx, cy - 120,
                    `you broke your last finger.\nGAME OVER.`,
                    {
                        fontSize: "28px",
                        color: "#ff0000",
                        backgroundColor: "#000",
                        padding: { x: 10, y: 10 }
                    }
                ).setOrigin(0.5);

                scene.time.delayedCall(2000, () => msg.destroy());
                showSaveUI(scene, true);
                return;
            }

            const msg = scene.add.text(cx, cy - 120,
                `you broke 1 finger.\n${scene.fingers} fingers left.`,
                {
                    fontSize: "28px",
                    color: "#ff0000",
                    backgroundColor: "#000",
                    padding: { x: 10, y: 10 }
                }
            ).setOrigin(0.5);

            scene.time.delayedCall(2000, () => msg.destroy());

            setTimeout(() => {
                scene.gameLocked = false;
            }, 1000);

            return;
        }

        if (now - lastClickAt < 30) return;
        lastClickAt = now;

        const idx = Math.min(
            Math.max(0, scene.clickIndex || 0),
            clickUpgrades.length - 1
        );

        const u = clickUpgrades[idx];

        const finalAdded =
            (Math.random() < u.chance ? u.max : u.min) *
            (scene.clickMultiplier || 1);

        scene.score += finalAdded;
        scene.scoreText.setText(scene.score);

        if (typeof scene.checkUnlocks === "function") {
            scene.checkUnlocks();
        }

        // cursor aligned
        const cursorX = scene.fakeCursor?.x ?? pointer.worldX;
        const cursorY = scene.fakeCursor?.y ?? pointer.worldY;

        showFloatingText(scene, cursorX, cursorY, `+${finalAdded}`, "#00ff00");
    });
}