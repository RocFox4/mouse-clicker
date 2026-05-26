import { clickUpgrades } from "./upgradeSystem.js";
import { showFloatingText } from "../ui/floatingText.js";

export function initClickSystem(scene) {

    // avoid initializing more than once
    if (scene._clickSystemInitialized) return;
    scene._clickSystemInitialized = true;

    const cx = scene.scale.width / 2;
    const cy = scene.scale.height / 2;

    const button = scene.add.circle(cx, cy + 40, 90, 0x00aaff).setInteractive({ useHandCursor: true });
    // expose main click button on scene so other systems can reference its bounds
    scene.mainClickButton = button;

    scene.add.text(cx, cy + 40, "CLICK", {
        fontSize: "28px",
        color: "#000"
    }).setOrigin(0.5);

    // use pointerup to avoid multiple firings from pointerdown/up combinations
    let lastClickAt = 0;
    button.on("pointerup", (pointer) => {
        const now = Date.now();
        if (now - lastClickAt < 50) return; // simple debounce
        lastClickAt = now;

        if (scene.gameLocked) return;

        // safe fallback: if clickIndex is beyond available upgrades, use the last upgrade
        const idx = Math.min(Math.max(0, scene.clickIndex || 0), clickUpgrades.length - 1);
        const u = clickUpgrades[idx];

        const added = Math.random() < u.chance ? u.max : u.min;
        const multiplier = scene.clickMultiplier || 1;
        const finalAdded = added * multiplier;

        scene.score += finalAdded;
        scene.scoreText.setText(scene.score);

        // Player clicks show green floating text
        showFloatingText(scene, pointer.worldX, pointer.worldY, `+${finalAdded}`, "#00ff00");
        console.log('clickSystem: added', finalAdded);
    });
}