const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

////////////////////////////////
// Canvas
// README: https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
canvas.width = 1152;
canvas.height = 864;

const scaledCanvas = {
  // we divide by 2 because we scaled the original background image by 2
  width: canvas.width / 2,
  height: canvas.height / 2,
};

////////////////////////////////
// Global variables
const gravity = 0.1; //FIXME: can edit this to decrease the height of the character jumping

////////////////////////////////
// Collision Block Creation

// 1. Floor collision detection
const floorCollisions2D = []; // 2D array to store floor collision positions. floorCollisions array is in the Collisions.js
for (let i = 0; i < floorCollisions.length; i += 36) {
  // i increment by 36 due to no. of tiles in the x-axis on the tile map
  floorCollisions2D.push(floorCollisions.slice(i, i + 36)); // slice out from the original 1D array, 36 tiles per row
}

const collisionBlocks = [];
floorCollisions2D.forEach((row, ycoord) => {
  row.forEach((symbol, xcoord) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: xcoord * 16, // 16px is the size of the block
            y: ycoord * 16, // 16px is the size of the block
          },
        })
      );
    }
  });
});

// 2. Platform collision detection
const platformCollisions2D = []; // 2D array to store platform collision positions
// TODO: change i to a variable that we can manipulate when our future map size changes ?
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = []; // array to store platform collision blocks object and its x and y positions
platformCollisions2D.forEach((row, rowIndex) => {
  row.forEach((symbol, colIndex) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: colIndex * 16, // 16px is the size of the block
            y: rowIndex * 16, // 16px is the size of the block
          },
          height: 4,
        })
      );
    }
  });
});

/////////////////////////////////
// Instantiate Enemy Object

// Randomly generate enemy objects at random positions

const enemyArray = [];

for (i = 0; i < 10; i++) {
  const x = Math.floor(Math.random() * 400);
  const y = Math.floor(Math.random() * 400);

  const enemy = new Enemy({
    position: {
      //FIXME: To edit these values
      x: x,
      y: y,
    },
    collisionBlocks: collisionBlocks,
    platformCollisionBlocks: platformCollisionBlocks,

    imageSrc: "./img/Skeleton - Base/Idle.png", // TODO: change out this image source
    frameRate: 4, // TODO: frame rate of current player sprite
    animations: {
      Idle: {
        imageSrc: "./img/Skeleton - Base/Idle.png", // TODO: change out this image source
        frameRate: 4, // TODO: frame rate of current player sprite
        frameBuffer: 1,
      },
      // FIXME: To add the other animation frames later
      // Run: {
      //   imageSrc: "./img/warrior/Run.png", // TODO: change out this image source
      //   frameRate: 8, // TODO: frame rate of current player sprite
      //   frameBuffer: 7,
      // },
      // Jump: {
      //   imageSrc: "./img/warrior/Jump.png", // TODO: change out this image source
      //   frameRate: 2, // TODO: frame rate of current player sprite
      //   frameBuffer: 5,
      // },
      // Fall: {
      //   imageSrc: "./img/warrior/Fall.png", // TODO: change out this image source
      //   frameRate: 2, // TODO: frame rate of current player sprite
      //   frameBuffer: 5,
      // },
      // FallLeft: {
      //   imageSrc: "./img/warrior/FallLeft.png", // TODO: change out this image source
      //   frameRate: 2, // TODO: frame rate of current player sprite
      //   frameBuffer: 5,
      // },
      // RunLeft: {
      //   imageSrc: "./img/warrior/RunLeft.png", // TODO: change out this image source
      //   frameRate: 8, // TODO: frame rate of current player sprite
      //   frameBuffer: 7,
      // },
      // IdleLeft: {
      //   imageSrc: "./img/warrior/IdleLeft.png", // TODO: change out this image source
      //   frameRate: 8, // TODO: frame rate of current player sprite
      //   frameBuffer: 5,
      // },
      // JumpLeft: {
      //   imageSrc: "./img/warrior/JumpLeft.png", // TODO: change out this image source
      //   frameRate: 2, // TODO: frame rate of current player sprite
      //   frameBuffer: 5,
      // },
    },
  });

  enemyArray.push(enemy);
  console.log(`loop ${i}: ${x} ${y}`);
}

console.log(enemyArray);

const player = new Player({
  position: {
    //FIXME: To edit these values
    x: 100,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,

  imageSrc: "./img/Adventurer/Idle.png", // TODO: change out this image source
  frameRate: 4, // TODO: frame rate of current player sprite
  animations: {
    Idle: {
      imageSrc: "./img/Adventurer/Idle.png", // TODO: change out this image source
      frameRate: 4, // TODO: frame rate of current player sprite
      frameBuffer: 16,
    },
    Run: {
      imageSrc: "./img/Adventurer/Run.png", // TODO: change out this image source
      frameRate: 5, // TODO: frame rate of current player sprite
      frameBuffer: 10,
    },
    Jump: {
      imageSrc: "./img/Adventurer/Jump.png", // TODO: change out this image source
      frameRate: 4, // TODO: frame rate of current player sprite
      frameBuffer: 16,
    },
    Fall: {
      imageSrc: "./img/Adventurer/Fall.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 10,
    },
    FallLeft: {
      imageSrc: "./img/Adventurer/FallLeft.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 10,
    },
    RunLeft: {
      imageSrc: "./img/Adventurer/RunLeft.png", // TODO: change out this image source
      frameRate: 5, // TODO: frame rate of current player sprite
      frameBuffer: 10,
    },
    IdleLeft: {
      imageSrc: "./img/Adventurer/IdleLeft.png", // TODO: change out this image source
      frameRate: 4, // TODO: frame rate of current player sprite
      frameBuffer: 16,
    },
    JumpLeft: {
      imageSrc: "./img/Adventurer/JumpLeft.png", // TODO: change out this image source
      frameRate: 4, // TODO: frame rate of current player sprite
      frameBuffer: 16,
    },
    Attack: {
      imageSrc: "./img/Adventurer/Attack.png", // TODO: change out this image source
      frameRate: 5, // TODO: frame rate of current player sprite
      frameBuffer: 30,
    },
    AttackLeft: {
      imageSrc: "./img/Adventurer/AttackLeft.png", // TODO: change out this image source
      frameRate: 5, // TODO: frame rate of current player sprite
      frameBuffer: 15,
    },
  },
});

////////////////////////////////
// Instantiate background sprite and camera panning
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

///////////////
// Keys array
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

//////////////////
// Score Tracking & Time Tracking
let score = 0;
let timer = 30;
let timerId;
function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000);
  if (timer > 0) {
    timer--;
    // score++;
    document.querySelector("#timer").innerHTML = "TIME: " + timer;
  }
  endGame();
}
decreaseTimer();

///////////////////////////
// Animation Loop Function

function animate() {
  reqAnim = window.requestAnimationFrame(animate); // function to run repeatedly

  // DOCUMENT: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save
  // context.save() saves the entire state of the canvas by pushing the current state onto a stack
  ctx.save(); //
  ctx.scale(2, 2); //TODO: Include this inside the readme document
  background.update();
  ////////////////////////////////////////////////////////////////
  // TODO: Explain collisionBlocks need to be rendered before context is restored
  // Below is to visualize the collision blocks
  // enemyHitboxes.forEach((collisionBlock) => {
  //   collisionBlock.update();
  // });

  // Platform collision block rendering by calling update() which calls draw()
  // platformCollisionBlocks.forEach((platformCollisionBlock) => {
  //   platformCollisionBlock.draw();
  // });
  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.draw();
  // });

  player.update();

  // COLLISION EXPERT BROOOOOOOO
  // Player and enemy collision
  // run a for loop to check over all enemy blocks
  enemyArray.forEach((enemy, index) => {
    if (player.attacking) {
      if (
        player.attackBox.position.x + player.attackBox.width >=
          enemy.hitbox.position.x &&
        player.attackBox.position.x <= enemy.hitbox.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >=
          enemy.hitbox.position.y &&
        player.attackBox.position.y <= enemy.hitbox.position.y + enemy.height
      ) {
        console.log("pop enemy out of array!");
        player.attacking = false;
        enemyArray.splice(index, 1);
        score++;
        console.log(score);
      }
    }

    if (
      player.hitbox.position.x + player.hitbox.width >=
        enemy.hitbox.position.x &&
      player.hitbox.position.x <= enemy.hitbox.position.x + enemy.width &&
      player.hitbox.position.y + player.hitbox.height >=
        enemy.hitbox.position.y &&
      player.hitbox.position.y <= enemy.hitbox.position.y + enemy.height
    ) {
      console.log("COLLISION EXPERT BRO- YOU DIED");
    }
    enemy.update();
  });

  // Reset movement when key is not pressed
  player.velocity.x = 0;
  if (keys.d.pressed) {
    player.switchSprite("Run");
    player.velocity.x = 2;
    player.lastDirection = "right";
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -2;
    player.lastDirection = "left";
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  // Attacking directions
  if (player.attacking && player.lastDirection === "right") {
    player.switchSprite("Attack"); //TODO: Animation not implemented properly yet.
    console.log("attacking");
  } else if (player.attacking && player.lastDirection === "left") {
    console.log("attack left");
  }

  // switch sprite to jump or fall depending on y-velocity
  if (player.velocity.y < 0) {
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Fall");
      // console.log("Fall right");
    } else {
      player.switchSprite("FallLeft");
      // console.log("Fall left");
    }
  }

  ctx.restore();
}

animate();
// FIXME: can remove these console logs
// console.log(enemy);
// console.log(enemyHitboxes);
////////////////////////////////
// Key Inputs

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = true;
      player.velocity.x = -1;
      break;
    case "d":
      keys.d.pressed = true;
      player.velocity.x = 1;
      break;
    case "w":
      player.velocity.y = -4; // controls the jump height
      break;
    case "Enter":
      player.attack();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    // case "Enter":
    //   break;
  }
});
