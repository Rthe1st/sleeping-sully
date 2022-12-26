import Phaser from "phaser";

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#33A5E7",
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
  // scale: {
  //   width: 800,
  //   height: 600,
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  // },
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "phaser-example",
    width: 1920,
    height: 1080,
    // min: {
    //   width: 0,
    //   height: 0,
    // },
    // max: {
    //   width: 1400,
    //   height: 1200,
    // },
  },
};
