// make floor
//fix colision physics
// add more players
// add flying mia
// add flying mia sound
// add jack wakes up aniamtion

import Phaser, { Scene } from "phaser";

function drawFLoor(scene: Scene, screenWidth: number) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  graphics.lineStyle(10, 0x000000, 1.0);
  graphics.fillStyle(0x000000, 1.0);
  graphics.beginPath();
  graphics.moveTo(screenWidth, 0);
  graphics.lineTo(screenWidth, 20);
  graphics.lineTo(0, 20);
  graphics.lineTo(0, 0);
  graphics.closePath();
  graphics.fillPath();
  graphics.strokePath();
  graphics.generateTexture("floor", screenWidth, 20);
}

function addButton(scene: Demo) {
  const helloButton = scene.add
    .text(scene.GAME_WIDTH / 2, scene.GAME_HEIGHT / 2, "Play", {
      font: "200px Courier",
      backgroundColor: "#aaaaaa",
    })
    .setOrigin(0.5);
  helloButton.setInteractive();
  return helloButton;
}

class Bullet extends Phaser.Physics.Arcade.Sprite {
  scene;

  constructor(scene, x, y) {
    super(scene, x, y, "bullet");
    this.scene = scene;
  }

  fire(x, y, angle) {
    this.enableBody(true, x, y, true, true);
    this.setBounce(1);
    this.setMass(100);
    this.scene.physics.velocityFromRotation(angle, 500, this.body.velocity);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (
      this.x < 0 ||
      this.y < 0 ||
      this.x > this.scene.GAME_WIDTH ||
      this.y > this.scene.GAME_HEIGHT
    ) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 10,
      key: "bullet",
      active: false,
      visible: false,
      classType: Bullet,
    });
  }

  fireBullet(x: number, y: number, angle: number) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y, angle);
    }
  }
}

class Jack extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x, y) {
    super(scene, x, y, "sleeping_jack");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVisible(true);
    this.setActive(true);
    this.setImmovable(true);
    this.body.setAllowGravity(false);
  }
}

class Mia extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "mia");
  }

  attack(x, y) {
    this.body.reset(x, 500);
    this.body.setCircle(this.frame.width / 2);
    this.setActive(true);
    this.setVisible(true);
    this.setMass(3);
    // this.setAngularVelocity(100);
    this.setVelocityX(80);
    this.setVelocityY(-400);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

class Explosion extends Phaser.Physics.Arcade.Sprite {
  s;
  constructor(scene, x, y) {
    super(scene, x, y, "explosion_img");
    this.s = this.scene.sound.add("explosion_sound", {
      volume: 0.3,
    });
  }

  go(x, y) {
    const e = this;
    this.enableBody(true, x, y, true, true);
    this.body.allowGravity = false;
    this.setActive(true);
    this.setVisible(true);
    this.anims.play("explode");

    this.s.on("complete", function (sound) {
      e.disableBody(true, true);
    });
    this.s.play({ loop: false });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

class Explosions extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);
    this.createMultiple([
      {
        frameQuantity: 10,
        // texture is really set by the srpite
        key: "explosion_img",
        active: false,
        visible: false,
        classType: Explosion,
      },
    ]);
  }

  go(x, y) {
    let bullet = this.getFirstDead(false);
    if (bullet) {
      bullet.go(x, y);
    }
  }
}

class Mias extends Phaser.Physics.Arcade.Group {
  music;
  constructor(scene: Scene, music) {
    super(scene.physics.world, scene);
    this.music = music;
    this.createMultiple([
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "mia",
        active: false,
        visible: false,
        classType: Mia,
      },
    ]);
  }

  attack(x, y) {
    let bullet = this.getFirstDead(false);
    if (bullet) {
      this.music.play();
      bullet.attack(x, y);
    }
  }
}

class BadGuy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  attack(x, y) {
    this.enableBody(true, x, y, true, true);
    // badguy.enableBody();
    // this.body.reset(x, y);
    this.body.setCircle(this.frame.width / 2);
    // this.setActive(true);
    // this.setVisible(true);
    this.setMass(30);
    this.setAngularVelocity(100);
    this.setVelocityX(200);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

class Laura extends BadGuy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "laura");
  }
}

class Charlotte extends BadGuy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "charlotte");
  }
}

class Mike extends BadGuy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "mike");
  }
}

class Trisha extends BadGuy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "trisha");
  }
}

class Annie extends BadGuy {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "annie");
  }
}

class BadGuys extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple([
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "laura",
        active: false,
        visible: false,
        classType: Laura,
      },
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "charlotte",
        active: false,
        visible: false,
        classType: Charlotte,
      },
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "mike",
        active: false,
        visible: false,
        classType: Mike,
      },
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "trisha",
        active: false,
        visible: false,
        classType: Trisha,
      },
      {
        frameQuantity: 1,
        // texture is really set by the srpite
        key: "annie",
        active: false,
        visible: false,
        classType: Annie,
      },
    ]);
  }

  attack(x, y) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.attack(x, y);
    }
  }
}

export default class Demo extends Phaser.Scene {
  GAME_WIDTH = 1920;
  GAME_HEIGHT = 1080;

  badguys?: BadGuys;
  button: Phaser.GameObjects.Text | null;
  jack?: Jack;
  mode: string = "menu";
  text: Phaser.GameObjects.Text | null;
  livesText?: Phaser.GameObjects.Text;
  mias?: Mias;
  music;
  explosions: Explosions;
  snore?: Phaser.Sound.BaseSound;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("annie", "assets/annie.png");
    this.load.image("charlotte", "assets/charlotte.png");
    this.load.image("jack", "assets/jack.png");
    this.load.image("night_sky", "assets/night_sky.jpg");
    this.load.image("angry_jack", "assets/angry_jack.png");
    this.load.image("sleeping_jack", "assets/sleeping_jack.png");
    this.load.image("laura", "assets/laura_medium.png");
    this.load.image("mia", "assets/mia.png");
    this.load.image("mike", "assets/mike.png");
    this.load.image("trisha", "assets/trisha.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("open_mouth", "assets/jack_open_mouth.png");
    this.load.image("sleepy_z", "assets/sleepy_z.png");
    this.load.audio("mia_scream", ["assets/mia_scream.ogg"]);
    this.load.audio("snore", ["assets/snoring.mp3"]);
    this.load.audio("awake_scream", ["assets/male-scream-fx.mp3"]);
    this.load.spritesheet("explosion_img", "assets/explosion.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio("explosion_sound", ["assets/explosion.mp3"]);
  }

  initialMenu(sc: Demo) {
    this.mode = "menu";
    this.text = this.add
      .text(this.GAME_WIDTH / 2, 200, "Sleeping Sully", {
        font: "100px Courier",
      })
      .setOrigin(0.5);
    this.subtext = this.add
      .text(this.GAME_WIDTH / 2, 320, "Don't let his family wake him", {
        font: "60px Courier",
      })
      .setOrigin(0.5);
    this.button = addButton(this);
    this.button.on("pointerdown", () => {
      this.play();
    });
    this.sleepingJackImage = this.add
      .image(this.GAME_WIDTH / 2 - 103, this.GAME_HEIGHT - 97, "sleeping_jack")
      .setScale(1 / 0.5)
      .setOrigin(0, 0);
    this.sleepingJackImage.setPosition(
      this.GAME_WIDTH / 2 - 150 - this.sleepingJackImage.width / 2,
      this.GAME_HEIGHT - 150 - this.sleepingJackImage.height / 2
    );
    this.big_zs = this.add
      .image(this.GAME_WIDTH / 2 + 250, this.GAME_HEIGHT - 250, "sleepy_z")
      .setDisplaySize(100, 100)
      .setOrigin(0, 0);
    this.tweens.add({
      targets: this.big_zs,
      // x: this.GAME_WIDTH / 2 + 200,
      // y: this.GAME_HEIGHT - 150,
      alpha: 0,
      duration: 3000,
      ease: "Liner",
      repeat: -1,
      yoyo: true,
    });
    //todo" init new jack image that has no physics
  }

  backToMenu(scene: Demo) {
    scene.mode = "menu";
    scene.snore?.stop();
    for (const bullet of this.badguys?.getChildren()) {
      this.badguys.killAndHide(bullet);
    }
    for (const bullet of this.mias?.getChildren()) {
      this.mias.killAndHide(bullet);
    }
    for (const bullet of this.bullets.getChildren()) {
      this.bullets.killAndHide(bullet);
    }
    this.sleepingJackImage.setVisible(true);
    this.jack?.disableBody(true, true);
    this.big_zs.setVisible(false);
    this.tweens.add({
      targets: this.big_zs,
      x: this.GAME_WIDTH / 2 + 250,
      y: this.GAME_HEIGHT - 250,
      duration: 3000,
      ease: "Power2",
    });

    this.angry_jack.setVisible(true);

    this.tweens.add({
      targets: this.angry_jack,
      x: this.GAME_WIDTH / 2 + 255,
      y: this.GAME_HEIGHT - 100,
      scale: 2.5,
      duration: 3000,
      ease: "Power2",
      completeDelay: 50,
      onComplete: () => {
        this.big_zs
          .setVisible(true)
          .setPosition(this.GAME_WIDTH / 2 + 250, this.GAME_HEIGHT - 250);
        this.angry_jack.setVisible(false);
        this.angry_jack
          .setPosition(this.GAME_WIDTH - 30, this.GAME_HEIGHT - 50)
          .setScale(0.6);
        this.livesText?.setVisible(false);
        this.text?.setVisible(true);
        this.subtext.setVisible(true);
        this.button?.setVisible(true);
        this.explosions.setVisible(false);
      },
    });

    this.tweens.addCounter({
      from: 0,
      to: 10,
      duration: 50,
      repeat: -1,
      onUpdate: function (tween) {
        scene.angry_jack.setAngle(tween.getValue());
      },
    });
    this.awakeScream.play();
    this.tweens.add({
      targets: this.sleepingJackImage,
      x: this.GAME_WIDTH / 2 - 150 - this.sleepingJackImage.width / 2,
      y: this.GAME_HEIGHT - 150 - this.sleepingJackImage.height / 2,
      // scale: this.sleepingJackImage.width / this.jack?.body.width,
      scale: 1 / this.jackScale,
      duration: 3000,
      ease: "Power2",
    });
  }

  play() {
    // todo: can we move this to match the sprite body?
    // this.big_zs.setVisible(false);
    this.text?.setVisible(false);
    this.subtext?.setVisible(false);
    this.data.set("lives", 3);
    this.livesText?.setText(["Lives: " + this.data.get("lives")]);
    this.livesText?.setVisible(true);
    this.button?.setVisible(false);
    this.tweens.add({
      targets: this.big_zs,
      x: this.jack.x + this.jack.width / 2 - 50,
      y: this.jack.y - 80,
      duration: 3000,
      ease: "Power2",
    });
    this.tweens.add({
      targets: this.sleepingJackImage,
      x: this.jack.x,
      y: this.jack.y,
      // scale: this.jack.body.width / this.sleepingJackImage.width,
      scale: this.jackScale,
      duration: 3000,
      ease: "Power2",
      onComplete: () => {
        this.jack.enableBody(true, this.jack.x, this.jack.y, true, true);
        this.sleepingJackImage.setVisible(false);
        this.mode = "play";
      },
    });
  }

  create() {
    const width = this.scale.gameSize.width;
    const height = this.scale.gameSize.height;
    this.parent = new Phaser.Structs.Size(width, height);
    this.sizer = new Phaser.Structs.Size(
      this.GAME_WIDTH,
      this.GAME_HEIGHT,
      Phaser.Structs.Size.FIT,
      this.parent
    );

    this.parent.setSize(width, height);
    this.sizer.setSize(width, height);

    this.updateCamera();

    this.scale.on("resize", this.resize, this);

    this.add
      .image(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "night_sky")
      .setDisplaySize(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.livesText = this.add.text(10, 10, "", { font: "80px Courier" });
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion_img", {
        start: 0,
        end: 23,
        first: 23,
      }),
      frameRate: 20,
      hideOnComplete: true,
    });
    drawFLoor(this, this.GAME_WIDTH);
    this.jack = new Jack(this, this.GAME_WIDTH, 500)
      .setScale(0.5)
      .setOrigin(0, 0);
    this.jack.refreshBody();
    this.jack.setPosition(
      this.GAME_WIDTH - this.jack.body.width - 10,
      this.GAME_HEIGHT - this.jack.body.height - 20
    );
    this.jack.setVisible(false);
    // this.add
    //   .image(this.jack.x + this.jack.width / 2, this.jack.y - 20, "sleepy_z")
    //   .setDisplaySize(50, 50);
    this.initialMenu(this);
    this.angry_jack = this.add
      .image(this.GAME_WIDTH - 30, this.GAME_HEIGHT - 50, "angry_jack")
      .setScale(0.6);
    this.angry_jack.setVisible(false);
    this.jackScale = this.jack.body.width / this.sleepingJackImage.width;
    const sc = this;
    this.data.set("lives", 3);
    this.physics.world.setBounds(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);
    const gunPosition = { x: this.GAME_WIDTH, y: this.GAME_HEIGHT };
    this.bullets = new Bullets(this);
    this.input.addPointer();
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (sc.mode != "play") {
        return;
      }
      const angle = Phaser.Math.Angle.BetweenPoints(gunPosition, {
        x: pointer.worldX,
        y: pointer.worldY,
      });
      this.bullets.fireBullet(gunPosition.x, gunPosition.y, angle);
    });

    const floor = this.physics.add.staticGroup();
    // todo: make more pprotie texture
    floor
      .create(this.GAME_WIDTH / 2, this.GAME_HEIGHT, "floor")
      .setScale(2)
      .refreshBody();

    this.awakeScream = this.sound.add("awake_scream");
    this.music = this.sound.add("mia_scream");
    this.snore = this.sound.add("snore");

    this.snore.on("complete", function (sound) {
      console.log("complete");
      setTimeout(
        function () {
          console.log("replay");
          sound.play();
        }.bind(sound),
        10
      );
    });

    this.snore.play();

    this.mias = new Mias(this, this.music);
    this.explosions = new Explosions(this);

    this.badguys = new BadGuys(this);

    this.physics.add.overlap(
      this.badguys,
      this.bullets,
      function (badguy, bullet) {
        if (!badguy.active || !bullet.active) {
          return;
        }
        bullet.disableBody(true, true);
        badguy.disableBody(true, true);
        sc.explosions.go(
          badguy.body.x + badguy.body.radius,
          badguy.body.y + badguy.body.radius
        );
      }
    );

    this.physics.add.overlap(this.mias, this.bullets, function (mia, bullet) {
      if (!mia.active || !bullet.active) {
        return;
      }
      mia.setActive(false);
      bullet.setActive(false);
      sc.explosions.go(
        mia.body.x + mia.body.radius,
        mia.body.y + mia.body.radius
      );
      mia.body.reset(-1000, 0);
      bullet.body.reset(-1000, 0);
    });

    this.physics.add.collider(this.badguys, floor);
    this.physics.add.collider(this.mias, floor);

    this.physics.add.overlap(this.mias, this.jack, function (jack, mia) {
      if (!mia.active || !jack.active) {
        return;
      }
      mia.setActive(false);
      mia.body.reset(-1000, -1000);
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives - 1);
        sc.livesText?.setText(["Lives: " + sc.data.get("lives")]);
      }
      if (lives == 0) {
        sc.backToMenu(sc);
      }
    });

    this.physics.add.overlap(this.badguys, this.jack, function (jack, badguy) {
      if (!badguy.active || !jack.active) {
        return;
      }
      badguy.setActive(false);
      badguy.body.reset(-1000, -1000);
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives - 1);
        sc.livesText?.setText(["Lives: " + sc.data.get("lives")]);
      }
      if (lives == 0) {
        sc.backToMenu(sc);
      }
    });
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    this.parent.setSize(width, height);
    this.sizer.setSize(width, height);

    this.updateCamera();
  }

  updateCamera() {
    const camera = this.cameras.main;

    const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5);
    const y = 0;
    const scaleX = this.sizer.width / this.GAME_WIDTH;
    const scaleY = this.sizer.height / this.GAME_HEIGHT;

    camera.setViewport(x, y, this.sizer.width, this.sizer.height);
    camera.setZoom(Math.max(scaleX, scaleY));
    camera.centerOn(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
  }

  getZoom() {
    return this.cameras.main.zoom;
  }

  update(time, delta) {
    if (this.mode == "play") {
      if (Math.random() > 0.95) {
        this.badguys.attack(-50, 300);
      }
      if (Math.random() > 0.98) {
        this.mias.attack(-50, 0);
      }
    }
  }
}
