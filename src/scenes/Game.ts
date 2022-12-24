// make floor
//fix colision physics
// add more players
// add flying mia
// add flying mia sound
// add jack wakes up aniamtion

import Phaser, { Scene } from "phaser";

function drawFLoor(scene: Scene, screenWidth: number) {
  const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
  graphics.lineStyle(10, 0xffff00, 1.0);
  graphics.fillStyle(0xffff00, 1.0);
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

function addButton(scene: Scene) {
  const helloButton = scene.add.text(10, 200, "Play");
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
    if (this.x < 0 || this.y < 0 || this.x > 800 || this.y > 600) {
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
  badguys;
  button: Phaser.GameObjects.Text | null;
  mode: string = "menu";
  text: Phaser.GameObjects.Text | null;
  mias;
  music;
  explosions;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("annie", "assets/annie.png");
    this.load.image("charlotte", "assets/charlotte.png");
    this.load.image("jack", "assets/jack.png");
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
    this.load.spritesheet("explosion_img", "assets/explosion.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio("explosion_sound", ["assets/explosion.mp3"]);
  }

  create() {
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion_img", {
        start: 0,
        end: 23,
        first: 23,
      }),
      frameRate: 20,
    });
    drawFLoor(this, 800);
    this.button = addButton(this);
    const jack = new Jack(this, 800, 500).setScale(0.5).setOrigin(0, 0);
    jack.refreshBody();
    jack.setPosition(800 - jack.body.width - 10, 600 - jack.body.height - 20);
    this.add
      .image(jack.x + jack.width / 2, jack.y - 20, "sleepy_z")
      .setDisplaySize(50, 50);
    const sc = this;
    this.text = this.add.text(10, 10, "", { font: "50px Courier" });
    this.text.setText(["Sleepy Sully", "Don't let his", "family wake him"]);
    this.data.set("lives", 3);
    this.button.on("pointerdown", () => {
      sc.data.set("lives", 3);
      sc.text.setText(["Lives: " + sc.data.get("lives")]);
      this.mode = "play";
      this.button?.setVisible(false);
    });
    this.physics.world.setBounds(0, 0, 800, 600);
    const gunPosition = { x: 700, y: 500 };
    const bullets = new Bullets(this);
    this.input.addPointer(5);
    this.input.on("pointerdown", (pointer) => {
      if (sc.mode != "play") {
        return;
      }
      const angle = Phaser.Math.Angle.BetweenPoints(gunPosition, pointer);
      bullets.fireBullet(gunPosition.x, gunPosition.y, angle);
    });

    const floor = this.physics.add.staticGroup();
    // todo: make more pprotie texture
    floor
      .create(800 / 2, 600, "floor")
      .setScale(2)
      .refreshBody();

    this.music = this.sound.add("mia_scream");
    const snore = this.sound.add("snore");

    snore.on("complete", function (sound) {
      console.log("complete");
      setTimeout(
        function () {
          console.log("replay");
          sound.play();
        }.bind(sound),
        10
      );
    });

    snore.play();

    this.mias = new Mias(this, this.music);
    this.explosions = new Explosions(this);

    this.badguys = new BadGuys(this);

    this.physics.add.overlap(this.badguys, bullets, function (badguy, bullet) {
      if (!badguy.active || !bullet.active) {
        return;
      }
      // badguy.setActive(false);
      // bullet.setActive(false);
      bullet.disableBody(true, true);
      badguy.disableBody(true, true);
      sc.explosions.go(
        badguy.body.x + badguy.body.radius,
        badguy.body.y + badguy.body.radius
      );
      // badguy.body.reset(-1000, 0);
      // bullet.body.reset(-1000, 0);
    });

    this.physics.add.overlap(this.mias, bullets, function (mia, bullet) {
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

    this.physics.add.overlap(this.mias, jack, function (jack, mia) {
      if (!mia.active || !jack.active) {
        return;
      }
      mia.setActive(false);
      mia.body.reset(-1000, -1000);
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives - 1);
        sc.text.setText(["Lives: " + sc.data.get("lives")]);
      }
      if (lives == 0) {
        sc.mode = "menu";
        sc.text.setText(["Sleepy Sully", "Don't let his", "family wake him"]);
        sc.button?.setVisible(true);
        snore.stop();
      }
    });

    this.physics.add.overlap(this.badguys, jack, function (jack, badguy) {
      if (!badguy.active || !jack.active) {
        return;
      }
      badguy.setActive(false);
      badguy.body.reset(-1000, -1000);
      let lives = sc.data.get("lives");
      if (lives > 0) {
        lives -= 1;
        sc.data.set("lives", lives - 1);
        sc.text.setText(["Lives: " + sc.data.get("lives")]);
      }
      if (lives == 0) {
        sc.mode = "menu";
        sc.text.setText(["Sleepy Sully", "Don't let his", "family wake him"]);
        sc.button?.setVisible(true);
        snore.stop();
      }
    });
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
