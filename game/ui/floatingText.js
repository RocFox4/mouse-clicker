export function showFloatingText(scene, x, y, text, color) {

    const t = scene.add.text(x, y, text, {
        fontSize: "20px",
        color
    }).setOrigin(0.5);

    scene.tweens.add({
        targets: t,
        y: y - 40,
        alpha: 0,
        duration: 500,
        onComplete: () => t.destroy()
    });
}