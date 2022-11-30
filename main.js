import Phaser from "phaser";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Global variables
let hero;
let cursors;
let eggScore = 0;
let eggCount;
let lifeScore = 3;
let lifeCount;
let dragons;
let eggs;
let eggs2;
let eggs3;
let gameOver = false;
let statusText;
let platforms;
let audio_theme;

let game = new Phaser.Game(config);

// Preload function
function preload() {
  this.load.image("dungeon", "assets/dungeon.png");
  this.load.image("dragon-asleep", "assets/dragon-asleep.png");
  this.load.image("dragon-awake", "assets/dragon-awake.png");
  this.load.image("egg", "assets/one-egg.png");
  this.load.image("egg2", "assets/two-eggs.png");
  this.load.image("egg3", "assets/three-eggs.png");
  this.load.image("eggCount", "assets/egg-count.png");
  this.load.image("lifeCount", "assets/life-count.png");

  // Loading spritesheets for run and idle anims
  this.load.spritesheet("idle", "assets/idle_sheet.png", {
    frameWidth: 80,
    frameHeight: 80
  });

  this.load.spritesheet("run", "assets/run_sheet.png", {
    frameWidth: 80,
    frameHeigth: 80
  });

  // Loading game theme sound
  this.load.audio("theme", "assets/theme.mp3");
}

// Create function
function create() {
  this.add.image(400, 300, "dungeon");

  // Appending hero sprite
  hero = this.physics.add.sprite(190, 300, "idle");
  hero.setBounce(0.2);
  hero.setCollideWorldBounds(true);

  // Adding theme sound
  audio_theme = this.sound.add("theme");
  audio_theme.play();

  // Anims for hero sprite
  this.anims.create({
    key: "left",
    frameRate: 35,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("run", { start: 1, end: 23 })
  });

  this.anims.create({
    key: "right",
    frameRate: 35,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("run", { start: 1, end: 23 })
  });

  this.anims.create({
    key: "idle",
    frameRate: 10,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("idle", { start: 1, end: 17 })
  });

  this.anims.create({
    key: "down",
    frameRate: 35,
    repeat: -1,
    frames: this.anims.generateFrameNumbers("run", { start: 1, end: 23 })
  });

  // Appending dragons
  dragons = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: "dragon-asleep",
    repeat: 2,
    setXY: { x: 620, y: 130, stepY: 180 }
  });

  dragons.children.iterate((child) => {
    child.anims.play(
      {
        key: "dragon-awake",
        frames: [{ key: "dragon-asleep" }, { key: "dragon-awake" }],
        // How often it changes from asleep to awake
        frameRate: 0.5+Math.random(),
        repeat: -1
      },
      true
    );
  });

  // Iterate over dragons and make them come awake randomly
  this.anims.create({
    key: "dragon-awake",
    frames: [{ key: "dragon-awake" }, { key: "dragon-asleep" }],
    repeat: 0
  });

  function animDragon(dragon) {
    dragon.anims.play(
      {
        key: "dragon-awake",
        frameRate: 0.5 + Math.random()
      },
      true
    );
    setTimeout(() => animDragon(dragon), 1000 + 5000 * Math.random());
  }

  dragons.children.iterate((child) => {
    animDragon(child);
  });

  // Appending eggs as a group
  eggs = this.physics.add.staticGroup({
    key: "egg",
    repeat: 2,
    setXY: { x: 40, y: 500, stepX: 200 }
  });

  eggs2 = this.physics.add.group({
    key: "egg2",
    repeat: 2,
    setXY: { x: 40, y: 320, stepX: 220 }
  });

  eggs3 = this.physics.add.group({
    key: "egg3",
    repeat: 2,
    setXY: { x: 40, y: 145, stepX: 245 }
  });

  // Appending egg and life count symbols
  platforms = this.physics.add.staticGroup();
  platforms.create(16, 583, "eggCount");
  platforms.create(80, 583, "lifeCount");

  // Scoring text
  eggCount = this.add.text(30, 570, "0", { fontSize: "30px", fill: "#000" });
  lifeCount = this.add.text(94, 570, "3", { fontSize: "30px", fill: "#000" });

  // End Screen text
  statusText = this.add.text(250, 250, "", {
    backgroundColor: "green",
    align: "center",
    fontSize: "19px",
    fill: "#000"
  });

  // Overlaps to make eggs dissapear when hero grabs it
  this.physics.add.overlap(hero, eggs, collectOneEgg, null, this);
  this.physics.add.overlap(hero, eggs2, collectTwoEgg, null, this);
  this.physics.add.overlap(hero, eggs3, collectThreeEgg, null, this);

  // Colliders for dragon fire breath to end game when touching
  this.physics.add.collider(hero, dragons, hitFireBreath, null, this);

  // Colliders for scoreboard at bottom so hero doesn't go through
  this.physics.add.collider(hero, platforms);
  this.physics.add.collider(hero, lifeCount);
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();

  // Left
  if (cursors.left.isDown) {
    hero.setVelocityX(-160);
    hero.flipX = true;
    hero.anims.play("left", true);

    // Right
  } else if (cursors.right.isDown) {
    hero.setVelocityX(160);
    hero.flipX = false;
    hero.anims.play("right", true);

    // Up
  } else if (cursors.up.isDown) {
    hero.setVelocityY(-160);
    hero.anims.play("right", true);

    // Down
  } else if (cursors.down.isDown) {
    hero.setVelocityY(160);
    hero.anims.play("down", true);

    // No weird gravity when character is idle
  } else {
    hero.anims.play("idle", true);

    hero.setVelocityX(0);
    hero.setVelocityY(0);
  }
}

// Global functions
function collectOneEgg(hero, egg) {
  egg.disableBody(true, true);
  eggScore += 1;
  eggCount.setText(eggScore);

  if (eggs.countActive(true) === 0) {
    console.log("I've got nothing left - Ian Beale circa 2014");
    eggs.children.iterate(function (child) {
      child.enableBody(true, child.x, 500, child.y, -500, true, true);
    });
  }
}

function collectTwoEgg(hero, egg2) {
  egg2.disableBody(true, true);
  eggScore += 2;
  eggCount.setText(eggScore);

  if (eggs2.countActive(true) === 0) {
    console.log("I've got nothing left - Ian Beale circa 2014");
    eggs2.children.iterate(function (child) {
      child.enableBody(true, child.x, 320, child.y, -320, true, true);
    });
  }
}

function collectThreeEgg(hero, egg3) {
  egg3.disableBody(true, true);
  eggScore += 3;
  eggCount.setText(eggScore);

  if (eggs3.countActive(true) === 0) {
    console.log("I've got nothing left - Ian Beale circa 2014");
    eggs3.children.iterate(function (child) {
      child.enableBody(true, child.x, 145, child.y, -145, true, true);
    });
  }
}
// Touching fire and game ending
function hitFireBreath(hero, dragon) {
  setTimeout(() => {
    lifeScore -= 1;
    lifeCount.setText(lifeScore);
  }, 10);

  if (lifeScore === 1 && audio_theme.isPlaying) {
    audio_theme.stop();
    gameOver = true;
    dragons.children.iterate(function (child) {
      child.disableBody(true, true);
    });
    hero.disableBody(true, true);
    statusText.setText(`You Loose! \n\nBut you garnered ${eggScore} eggs!`);
  } else {
    this.physics.pause();
    hero.setTint(0xff0000);

    this.time.delayedCall(100, resume, []);

    setTimeout(() => {
      this.physics.resume();
    }, 900);
  }
}

function resume() {
  hero.clearTint();
  hero.setPosition(190, 300);
}
