export function showFloatingText(scene, x, y, text, color = null, type = "click") {
    if (!scene.fxPool) {
        scene.fxPool = [];
    }

    // Limit pool size to prevent memory leaks
    if (scene.fxPool.length > 50) {
        const excess = scene.fxPool.splice(0, 10);
        excess.forEach(t => t.destroy());
    }

    let t = scene.fxPool.pop();

    if (!t) {
        t = scene.add.text(0, 0, "", {
            fontSize: "20px",
            color: "#ffffff"
        }).setOrigin(0.5);
    }

    // Determine color based on type if not provided
    let finalColor = color;
    if (!finalColor) {
        if (type === "employee") {
            finalColor = "#ff4444";
        } else {
            finalColor = "#00ff66";
        }
    }

    t.setStyle({ color: finalColor });
    t.setText(text);
    t.setPosition(x, y);
    t.setAlpha(1);
    t.setVisible(true);

    scene.tweens.add({
        targets: t,
        y: y - 40,
        alpha: 0,
        duration: 500,
        onComplete: () => {
            t.setVisible(false);
            scene.fxPool.push(t);
        }
    });
}