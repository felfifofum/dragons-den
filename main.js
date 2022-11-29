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
let lifeCount = 3;
let dragons;
let eggs;
let oneEgg;
let twoEggs;
let threeEggs;

let game = new Phaser.Game(config);

// Preload function
function preload() {
  this.load.image("dungeon", "assets/dungeon.png");
  this.load.image("dragon-asleep", "assets/dragon-asleep.png");
  this.load.image("dragon-awake", "assets/dragon-awake.png");
  this.load.image("egg", "assets/one-egg.png");
  // this.load.image("two-eggs", "assets/two-eggs.png");
  // this.load.image("three-eggs", "assets/three-eggs.png");
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
        frameRate: Math.random(),
        repeat: -1
      },
      true
    );
  });

  // Appending dragons as a group + iterate over dragons and make them come awake randomly
  dragons = this.physics.add.staticGroup({
    setScale: { x: 0.9, y: 0.9 },
    key: "dragon-asleep",
    repeat: 2,
    setXY: { x: 620, y: 130, stepY: 180 }
  });

  this.anims.create({
    key: "dracaris",
    frames: [
      { key: "dragon-awake", duration: 1000 },
      { key: "dragon-asleep", duration: 0 }
    ]
  });

  function animDragon(dragon) {
    dragon.anims.play({
      key: "dracaris"
    });
    setTimeout(() => animDragon(dragon), 1000 + 2000 * Math.random());
  }

  dragons.children.iterate((child) => animDragon(child));

  // Appending eggs as a group
  eggs = this.physics.add.staticGroup({
    key: "egg",
    repeat: 2,
    setXY: { x: 12, y: 500, stepX: 200 }
  });


  // twoEggs = this.physics.add.group({
  //   setScale: { x: 0.9, y: 0.9 },
  //   key: "two-eggs",
  //   setXY: { x: 420, y: 320 }
  // });

  // threeEggs = this.physics.add.group({
  //   setScale: { x: 0.9, y: 0.9 },
  //   key: "three-eggs",
  //   setXY: { x: 420, y: 500 }
  // });

  // Appending egg and life count symbols
  this.add.image(16, 583, "egg-count");
  this.add.image(80, 583, "life-count");

  // Scoring text
  eggCount = this.add.text(30, 570, "0", { fontSize: "30px", fill: "#000" });
  lifeCount = this.add.text(94, 570, "3", { fontSize: "30px", fill: "#000" });

  // Colliders to make eggs dissapear when hero grabs it
  this.physics.add.overlap(hero, eggs, collectOneEgg, null, this);
  // this.physics.add.collider(hero, twoEggs, collectTwoEgg, null, this);
  // this.physics.add.collider(hero, threeEggs, collectThreeEgg, null, this);
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();

  // Left
  if (cursors.left.isDown) {
    hero.setVelocityX(-160);

    // Right
  } else if (cursors.right.isDown) {
    hero.setVelocityX(160);

    // Up
  } else if (cursors.up.isDown) {
    hero.setVelocityY(-160);

    // Down
  } else if (cursors.down.isDown) {
    hero.setVelocityY(160);

    // No weird gravity when character is idle
  } else {
    hero.setVelocityX(0);
    hero.body.velocity.y = 0;
  }
}

// Global functions
function collectOneEgg(hero, egg) {
  egg.disableBody(true, true);
  eggScore += 1;
  eggCount.setText(eggScore);

  if (eggs.countActive(true) === 0) {
    eggs.children.iterate(function (child) {
      child.enableBody(true, child.x, 500, child.y,-500,true, true);
    });
  }
}

// function collectTwoEgg(hero, twoEggs) {
//   twoEggs.disableBody(true, true);
//   eggScore += 2;
//   eggCount.setText(eggScore);
// }

// function collectThreeEgg(hero, threeEggs) {
//   threeEggs.disableBody(true, true);
//   eggScore += 3;
//   eggCount.setText(eggScore);
// }
