import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "phaser-example",
    width: 1920,
    height: 1080,
  },
};
