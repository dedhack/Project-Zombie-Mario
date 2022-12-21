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

////////////////////////////////
// Instantiate player object

// FIXME: remove Bullets
// const bulletController = new BulletController(canvas);

const player = new Player({
  position: {
    //FIXME: To edit these values
    x: 100,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,

  imageSrc: "./img/warrior/Idle.png", // TODO: change out this image source
  frameRate: 8, // TODO: frame rate of current player sprite
  animations: {
    Idle: {
      imageSrc: "./img/warrior/Idle.png", // TODO: change out this image source
      frameRate: 8, // TODO: frame rate of current player sprite
      frameBuffer: 3,
    },
    Run: {
      imageSrc: "./img/warrior/Run.png", // TODO: change out this image source
      frameRate: 8, // TODO: frame rate of current player sprite
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: "./img/warrior/Jump.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 5,
    },
    Fall: {
      imageSrc: "./img/warrior/Fall.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 5,
    },
    FallLeft: {
      imageSrc: "./img/warrior/FallLeft.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 5,
    },
    RunLeft: {
      imageSrc: "./img/warrior/RunLeft.png", // TODO: change out this image source
      frameRate: 8, // TODO: frame rate of current player sprite
      frameBuffer: 7,
    },
    IdleLeft: {
      imageSrc: "./img/warrior/IdleLeft.png", // TODO: change out this image source
      frameRate: 8, // TODO: frame rate of current player sprite
      frameBuffer: 5,
    },
    JumpLeft: {
      imageSrc: "./img/warrior/JumpLeft.png", // TODO: change out this image source
      frameRate: 2, // TODO: frame rate of current player sprite
      frameBuffer: 5,
    },
  },
  // bulletController, // FIXME: remove
});

/////////////////////////////////
// Instantiate Enemy Object

const enemy = new Enemy({
  position: {
    //FIXME: To edit these values
    x: 400,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
  platformCollisionBlocks: platformCollisionBlocks,

  imageSrc: "./img/Skeleton - Base/Idle.png", // TODO: change out this image source
  frameRate: 4, // TODO: frame rate of current player sprite
  animations: {
    Idle: {
      imageSrc: "./img/Wild Zombie/Idle.png", // TODO: change out this image source
      frameRate: 4, // TODO: frame rate of current player sprite
      frameBuffer: 3,
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

////////////////////////////////
// Instantiate background sprite and camera panning
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

///////////////////////////
// Animation Loop Function

function animate() {
  window.requestAnimationFrame(animate); // function to run repeatedly

  // DOCUMENT: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save
  // context.save() saves the entire state of the canvas by pushing the current state onto a stack
  ctx.save(); //
  ctx.scale(2, 2); //TODO: Include this inside the readme document
  //   ctx.translate(0, -background.image.height + scaledCanvas.height); //FIXME: Remove this since we no longer using translate to move around the canvas
  background.update();
  ////////////////////////////////////////////////////////////////
  // TODO: Explain collisionBlocks need to be rendered before context is restored
  // Below is to visualize the collision blocks
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  // Platform collision block rendering
  platformCollisionBlocks.forEach((platformCollisionBlock) => {
    platformCollisionBlock.update();
  });
  player.update();
  enemy.update();

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

  // switch sprite to jump or fall depending on y-velocity
  if (player.velocity.y < 0) {
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft"); // FIXME: animation not jumping correctly to the right
  } else if (player.velocity.y > 0) {
    if (player.lastDirection.y === "right") player.switchSprite("Fall");
    else player.switchSprite("FallLeft");
  }

  ctx.restore();
}

animate();

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
    case "Enter": //TODO: Add a downward velocity if want to consider downward attacks
      player.shootPressed = true;
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
    case "Enter": //TODO: Add a downward velocity if want to consider downward attacks
      player.shootPressed = false;
      break;
  }
});
