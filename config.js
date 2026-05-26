export function getPhaserConfig(GameScene) {
    return {
        type: Phaser.AUTO,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 600
        },
        backgroundColor: '#2d2d2d',
        parent: 'game-container',
        scene: GameScene
    };
}
 