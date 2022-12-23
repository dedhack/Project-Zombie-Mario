const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

////////////////////////////////
// Canvas
canvas.width = 1152;
canvas.height = 864;

////////////////////////////////
// Global variables

// Setting gravity
const gravity = 0.1; //FIXME: can edit this to control how fast the player falls

// Score Tracking & Time Tracking
let score = 0; // Variable to keep track of our score
let timer = 60; // FIXME: can edit this to manipulate the time. Future difficulties will just need to change this via
let timerId;
let numOfEnemies = 20;

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
    if (symbol === 202 || symbol === 7638) {
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
// Instantiate Enemy Objects

//  Generate enemy objects at random positions
const enemyArray = [];

for (i = 0; i < numOfEnemies; i++) {
  const x = 50 + Math.floor(Math.random() * 500);
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
    },
  });
  enemyArray.push(enemy);
}

const player = new Player({
  position: {
    //FIXME: To edit these values
    x: 10,
    y: 170,
  },
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,

  imageSrc: "./img/Adventurer/Idle.png",
  frameRate: 4,
  animations: {
    Idle: {
      imageSrc: "./img/Adventurer/Idle.png",
      frameRate: 4,
      frameBuffer: 16,
    },
    Run: {
      imageSrc: "./img/Adventurer/Run.png",
      frameRate: 5,
      frameBuffer: 10,
    },
    Jump: {
      imageSrc: "./img/Adventurer/Jump.png",
      frameRate: 4,
      frameBuffer: 16,
    },
    Fall: {
      imageSrc: "./img/Adventurer/Fall.png",
      frameRate: 2,
      frameBuffer: 10,
    },
    FallLeft: {
      imageSrc: "./img/Adventurer/FallLeft.png",
      frameRate: 2,
      frameBuffer: 10,
    },
    RunLeft: {
      imageSrc: "./img/Adventurer/RunLeft.png",
      frameRate: 5,
      frameBuffer: 10,
    },
    IdleLeft: {
      imageSrc: "./img/Adventurer/IdleLeft.png",
      frameRate: 4,
      frameBuffer: 16,
    },
    JumpLeft: {
      imageSrc: "./img/Adventurer/JumpLeft.png",
      frameRate: 4,
      frameBuffer: 16,
    },
    Attack: {
      imageSrc: "./img/Adventurer/Attack.png",
      frameRate: 5,
      frameBuffer: 28,
    },
    AttackLeft: {
      imageSrc: "./img/Adventurer/AttackLeft.png",
      frameRate: 5,
      frameBuffer: 15,
    },
  },
});

////////////////////////////////
// Instantiate background sprite
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/gaMAP.png",
});

////////////////////////////////
// Music
const music = document.querySelector("#audio");
const victorySound = document.querySelector("#victory-sound");
const defeatSound = document.querySelector("#defeat-sound");
const sword = document.querySelector("#sword");

music.play();
music.volume = 0.5;

////////////////////////////////
// Keys array to keep track if left and right movement pressed
const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

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
      player.velocity.y = -3; // controls the jump height
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
  }
});

///////////////////////////
// Animation Loop Function

function animate() {
  reqAnim = window.requestAnimationFrame(animate); // function to run repeatedly

  // DOCUMENT: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save
  // context.save() saves the entire state of the canvas by pushing the current state onto a stack
  ctx.save(); // you ned to to ensure the scaling following this doesn't take into effect
  ctx.scale(2, 2); //TODO: Include this inside the readme document
  background.update();

  player.update();
  player.velocity.x = 0; // Reset movement when key is not pressed

  // Player and enemy collision & attack check.
  enemyArray.forEach((enemy, index) => {
    // check if player attack hitbox hits enemy hitbox
    if (player.attacking) {
      if (
        player.attackBox.position.x + player.attackBox.width >=
          enemy.hitbox.position.x &&
        player.attackBox.position.x <= enemy.hitbox.position.x + enemy.width &&
        player.attackBox.position.y + player.attackBox.height >=
          enemy.hitbox.position.y &&
        player.attackBox.position.y <= enemy.hitbox.position.y + enemy.height
      ) {
        player.attacking = false;
        enemyArray.splice(index, 1);
        sword.play();
        score++;
      }
    }

    // check if player sprite hitbox hits enemy hitbox
    if (
      player.hitbox.position.x + player.hitbox.width >=
        enemy.hitbox.position.x &&
      player.hitbox.position.x <= enemy.hitbox.position.x + enemy.width &&
      player.hitbox.position.y + player.hitbox.height >=
        enemy.hitbox.position.y &&
      player.hitbox.position.y <= enemy.hitbox.position.y + enemy.height
    ) {
      let isCollision = true;
      endGame(isCollision);
    }
    enemy.update();
  });

  // Player attacking directions
  if (player.attacking && player.lastDirection === "right") {
    player.switchSprite("Attack"); //TODO: Animation not implemented properly yet.
  } else if (player.attacking && player.lastDirection === "left") {
  }

  if (keys.d.pressed) {
    if (player.position.x + player.hitbox.width < canvas.width) {
      player.switchSprite("Run");
      player.velocity.x = 1;
      player.lastDirection = "right";
    } else {
      player.switchSprite("Run");
      player.velocity.x = -1;
      player.lastDirection = "right";
    }
  } else if (keys.a.pressed) {
    player.switchSprite("RunLeft");
    player.velocity.x = -1;
    player.lastDirection = "left";
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === "right") player.switchSprite("Idle");
    else player.switchSprite("IdleLeft");
  }

  // switch sprite to jump or fall depending on y-velocity
  if (player.velocity.y < 0) {
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft");
  } else if (player.velocity.y > 0) {
    if (player.lastDirection === "right") {
      player.switchSprite("Fall");
    } else {
      player.switchSprite("FallLeft");
    }
  }
  ctx.restore(); // restores the context
}

animate();

// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Game_over
function restartGame() {
  const restartBtn = document.getElementById("restart");
  restartBtn.style.display = "flex";
  restartBtn.addEventListener("click", () => document.location.reload());
}

function endGame(collision) {
  if (score === numOfEnemies) {
    clearTimeout(timerId); // Reset the
    music.pause();
    victorySound.play();
    document.querySelector("#results").innerHTML = "YOU WIN";
    document.querySelector("#results").style.display = "flex";
    window.cancelAnimationFrame(reqAnim);
    restartGame();
  } else if ((timer === 0 && score < numOfEnemies) || collision === true) {
    clearTimeout(timerId);
    music.pause();
    defeatSound.play();
    document.querySelector("#results").innerHTML = "GAMEOVER";
    document.querySelector("#results").style.display = "flex";
    window.cancelAnimationFrame(reqAnim);
    restartGame();
  }
}

function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000); // 1000 milliseconds or 1 second
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = "TIME: " + timer;
  }
  endGame(false);
}
decreaseTimer();
