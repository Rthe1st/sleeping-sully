import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 },
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugBodyColor: 0x0000ff,
      debugStaticBodyColor: 0xffffff,
    },
  },
};
