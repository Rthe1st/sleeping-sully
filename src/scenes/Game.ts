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

function drawBullet(scene: Scene) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  graphics.fillStyle(0xffffff);
  graphics.fillCircleShape(new Phaser.Geom.Circle(10, 10, 10));
  graphics.generateTexture("draw_bullet", 20, 20);
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
    super(scene, x, y, "draw_bullet");
    this.scene = scene;
  }

  fire(x, y, angle) {
    this.setOrigin(0.5);
    this.body.setCircle(this.width / 2);
    this.refreshBody();
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
      key: "draw_bullet",
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
    this.s = this.scene.sound.add("mia_scream");
  }

  attack(mode: number) {
    this.s.play();
    this.enableBody(
      true,
      -50,
      this.scene.GAME_HEIGHT - this.body.height / 2 - 20,
      true,
      true
    );
    this.body.setCircle(this.frame.width / 2);
    this.setMass(3);
    if (mode == 0) {
      this.setVelocityX(200);
      this.setVelocityY(-450);
    } else if (mode === 1) {
      this.setVelocityX(280);
      this.setVelocityY(-350);
    } else {
      this.setVelocityX(240);
      this.setVelocityY(-400);
    }
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.x > this.scene.GAME_WIDTH) {
      this.setActive(false);
    }
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
  constructor(scene: Scene) {
    super(scene.physics.world, scene);
    this.createMultiple([
      {
        frameQuantity: 3,
        // texture is really set by the srpite
        key: "mia",
        active: false,
        visible: false,
        classType: Mia,
      },
    ]);
  }

  attack() {
    let mia = this.getFirstDead(false);
    if (mia) {
      const mode = Math.floor(Math.random() * 3);
      mia.attack(mode);
    }
  }
}

class BadGuy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  }

  attack(x, y, bounce) {
    this.enableBody(true, x, y, true, true);
    this.setBounce(bounce);
    this.body.setCircle(this.frame.width / 2);
    this.setMass(30);
    this.setAngularVelocity(100);
    this.setVelocityX(200);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.x > this.scene.GAME_WIDTH) {
      this.setActive(false);
    }
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
        frameQuantity: 4,
        // texture is really set by the srpite
        key: "laura",
        active: false,
        visible: false,
        classType: Laura,
      },
      {
        frameQuantity: 4,
        // texture is really set by the srpite
        key: "charlotte",
        active: false,
        visible: false,
        classType: Charlotte,
      },
      {
        frameQuantity: 4,
        // texture is really set by the srpite
        key: "mike",
        active: false,
        visible: false,
        classType: Mike,
      },
      {
        frameQuantity: 4,
        // texture is really set by the srpite
        key: "trisha",
        active: false,
        visible: false,
        classType: Trisha,
      },
      {
        frameQuantity: 4,
        // texture is really set by the srpite
        key: "annie",
        active: false,
        visible: false,
        classType: Annie,
      },
    ]);
  }

  attack() {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      // 150 is max radius of any spirts
      const y = 151 + Math.random() * 600;
      bullet.attack(-50, this.scene.GAME_HEIGHT - y, Math.random() * 0.6 + 0.3);
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
  explosions: Explosions;
  snore?: Phaser.Sound.BaseSound;
  nightSky?: Phaser.GameObjects.Image;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("annie", "assets/annie_small.png");
    this.load.image("charlotte", "assets/charlotte_small.png");
    this.load.image("night_sky", "assets/night_sky.jpg");
    this.load.image("angry_jack", "assets/angry_jack.png");
    this.load.image("sleeping_jack", "assets/sleeping_jack.png");
    this.load.image("laura", "assets/laura_small.png");
    this.load.image("mia", "assets/mia.png");
    this.load.image("mike", "assets/mike_small.png");
    this.load.image("trisha", "assets/trisha_small.png");
    this.load.image("sleepy_z", "assets/sleepy_z.png");
    this.load.audio("mia_scream", ["assets/mia_scream.mp3"]);
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
      alpha: 0,
      duration: 3000,
      ease: "Liner",
      repeat: -1,
      yoyo: true,
    });
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
        this.snore?.play();
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

    this.gameOverText.setVisible(true);

    this.tweens.add({
      targets: this.gameOverText,
      alpha: 1,
      duration: 1500,
      ease: "Power2",
      yoyo: 1,
      onComplete: () => {
        this.gameOverText.setVisible(false);
      },
    });

    this.tweens.addCounter({
      from: 0,
      to: 2,
      duration: 50,
      repeat: 3000 / 50 + 50,
      onUpdate: function (tween) {
        scene.angry_jack.setAngle(tween.getValue());
        scene.gameOverText.setAngle(tween.getValue());
      },
    });
    this.awakeScream.play();
    this.tweens.add({
      targets: this.sleepingJackImage,
      x: this.GAME_WIDTH / 2 - 150 - this.sleepingJackImage.width / 2,
      y: this.GAME_HEIGHT - 150 - this.sleepingJackImage.height / 2,
      scale: 1 / this.jackScale,
      duration: 3000,
      ease: "Power2",
    });
  }

  play() {
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
      scale: this.jackScale,
      duration: 3000,
      ease: "Power2",
      onComplete: () => {
        this.jack.enableBody(true, this.jack.x, this.jack.y, true, true);
        this.sleepingJackImage.setVisible(false);
        this.mode = "play";
        this.difficulty = 1000;
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

    this.nightSky = this.add
      .image(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "night_sky")
      .setDisplaySize(this.GAME_WIDTH, this.GAME_HEIGHT);

    this.gameOverText = this.add
      .text(this.GAME_WIDTH / 2, 200, ["Noooo", "They woke him up!"], {
        font: "100px Courier",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setVisible(false);

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
    drawBullet(this);
    this.jack = new Jack(this, this.GAME_WIDTH, 500)
      .setScale(0.5)
      .setOrigin(0, 0);
    this.jack.refreshBody();
    this.jack.setPosition(
      this.GAME_WIDTH - this.jack.body.width - 10,
      this.GAME_HEIGHT - this.jack.body.height - 20
    );
    this.jack.setVisible(false);
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
    this.snore = this.sound.add("snore");

    this.snore.play({ loop: true });

    this.mias = new Mias(this);
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
      mia.disableBody(true, true);
      bullet.disableBody(true, true);
      sc.explosions.go(
        mia.body.x + mia.body.radius,
        mia.body.y + mia.body.radius
      );
    });

    this.physics.add.collider(this.badguys, floor);
    this.physics.add.collider(this.mias, floor);

    this.physics.add.overlap(this.mias, this.jack, function (jack, mia) {
      if (!mia.active || !jack.active) {
        return;
      }
      sc.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 500,
        onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          sc.nightSky?.setTint(Phaser.Display.Color.GetColor(value, 0, 0));
        },
        onComplete: () => sc.nightSky?.clearTint(),
      });
      mia.disableBody(true, true);
      sc.explosions.go(
        mia.body.x + mia.body.radius,
        mia.body.y + mia.body.radius
      );
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives);
        sc.livesText?.setText(`Lives: ${lives}`);
      }
      if (lives == 0) {
        sc.backToMenu(sc);
      }
    });

    this.physics.add.overlap(this.badguys, this.jack, function (jack, badguy) {
      if (!badguy.active || !jack.active) {
        return;
      }
      badguy.disableBody(true, true);
      sc.explosions.go(
        badguy.body.x + badguy.body.radius,
        badguy.body.y + badguy.body.radius
      );
      sc.tweens.addCounter({
        from: 255,
        to: 0,
        duration: 500,
        onUpdate: (tween) => {
          const value = Math.floor(tween.getValue());
          sc.nightSky?.setTint(Phaser.Display.Color.GetColor(value, 0, 0));
        },
        onComplete: () => sc.nightSky?.clearTint(),
      });
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives);
        sc.livesText?.setText(`Lives: ${lives}`);
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
      this.difficulty += delta;
      const maxDiff = 120000 * 4;
      this.difficulty = Math.min(this.difficulty, maxDiff);
      if (Math.random() * maxDiff < this.difficulty) {
        this.badguys.attack();
      }
      if (Math.random() * maxDiff < this.difficulty / 4) {
        this.mias.attack();
      }
    }
  }
}
