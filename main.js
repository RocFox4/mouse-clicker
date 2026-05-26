import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,

    parent: "game-container",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 600
    },

    backgroundColor: "#2d2d2d",

    scene: [GameScene]
};

new Phaser.Game(config);