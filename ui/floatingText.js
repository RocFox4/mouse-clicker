export function showFloatingText(scene, x, y, text, color = null, type = "click") {

    if (!scene.fxPool) scene.fxPool = [];

    let t = scene.fxPool.pop();

    if (!t) {
        t = scene.add.text(0, 0, "", {
            fontSize: "20px",
            color: "#ffffff"
        }).setOrigin(0.5);
    }

    // 🎯 COLOR AUTOMÀTIC SEGONS TIPUS
    let finalColor = color;

    if (!finalColor) {
        if (type === "employee") {
            finalColor = "#ff4444";
        } else {
            finalColor = "#00ff66"; // SEMPRE clicks verds
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