import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    parent: "game-container",

    width: window.innerWidth,
    height: window.innerHeight,

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    },

    scene: [GameScene]
};

new Phaser.Game(config);