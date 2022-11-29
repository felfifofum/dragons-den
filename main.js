import Phaser from "phaser";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
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
let eggCount;
let lifeCount;
let dragons;
let oneEgg;
let twoEggs;
let threeEggs;

let game = new Phaser.Game(config);

// Preload function
function preload() {
  this.load.image("dungeon", "assets/dungeon.png");
  this.load.image("dragon-asleep", "assets/dragon-asleep.png");
  this.load.image("dragon-awake", "assets/dragon-awake.png");
  this.load.image("one-egg", "assets/one-egg.png");
  this.load.image("two-eggs", "assets/two-eggs.png");
  this.load.image("three-eggs", "assets/three-eggs.png");
  this.load.image("egg-count", "assets/egg-count.png");
  this.load.image("life-count", "assets/life-count.png");
  this.load.spritesheet("hero", "assets/hero.png", {
    frameWidth: 50,
    frameHeight: 58
  });
}

// Create function
function create() {
  this.add.image(400, 300, "dungeon");

  // Appending hero sprite
  hero = this.physics.add.sprite(190, 300, "hero");
  hero.setBounce(0.2);
  hero.setCollideWorldBounds(true);

  // Appending dragons as a group + iterate over dragons and make them come awake randomly

  let dragonState = ["dragon-asleep", "dragon-awake"];
  dragons = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: dragonState[0],
    repeat: 2,
    setXY: { x: 620, y: 130, stepY: 180 }
  });

  // dragons.children.iterate(function (child) {
  //   child.setAll("key", dragonArr[1]);
  // });

  // Appending eggs as a group
  oneEgg = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: "one-egg",
    setXY: { x: 420, y: 130 }
  });

  twoEggs = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: "two-eggs",
    setXY: { x: 420, y: 320 }
  });

  threeEggs = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: "three-eggs",
    setXY: { x: 420, y: 500 }
  });

  // Appending egg and life count symbols
  this.add.image(16, 583, "egg-count");
  this.add.image(80, 583, "life-count");

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("hero"),
    frameRate: 10,
    repeat: -1
  });

  // Scoring test
  eggCount = this.add.text(30, 564, "0", { fontSize: "40px", fill: "#000" });
  lifeCount = this.add.text(94, 564, "0", { fontSize: "40px", fill: "#000" });
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();

  // Left
  if (cursors.left.isDown) {
    hero.setVelocityX(-160);
  }
}
