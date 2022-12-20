const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

////////////////////////////////
// Canvas
canvas.width = 1024;
canvas.height = 576;

const scaledCanvas = {
  // we divide by 4 because we scaled the original background image by 4
  width: canvas.width / 4,
  height: canvas.height / 4,
};

////////////////////////////////
// Global variables
const gravity = 0.5; //FIXME: can edit this to decrease the height of the character jumping

////////////////////////////////
// Collision Block Creation

// 1. Floor collision detection
const floorCollisions2D = []; // 2D array to store floor collision positions
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
        })
      );
    }
  });
});

////////////////////////////////
// Instantiate player object
const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
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
});

console.log(typeof collisionBlocks);

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

function animate() {
  window.requestAnimationFrame(animate); // function to run repeatedly

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // DOCUMENT: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save
  // context.save() saves the entire state of the canvas by pushing the current state onto a stack
  ctx.save(); //
  ctx.scale(4, 4); //TODO: Include this inside the readme document
  ctx.translate(0, -background.image.height + scaledCanvas.height);
  background.update();
  ////////////////////////////////////////////////////////////////
  // TODO: Explain collisionBlocks need to be rendered before context is restored
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  // Platform collision block rendering
  platformCollisionBlocks.forEach((platformCollisionBlock) => {
    platformCollisionBlock.update();
  });
  player.update();

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

  // switch sprite to jump sprite if y velocity is negative i.e. moving up
  if (player.velocity.y < 0) {
    if (player.lastDirection === "right") player.switchSprite("Jump");
    else player.switchSprite("JumpLeft"); // TODO: animation not jumping correctly to the right
  } else if (player.velocity.y > 0) {
    if (player.lastDirection.y === "right") player.switchSprite("FallRight");
    else player.switchSprite("FallLeft");
  }

  ctx.restore();
}

animate();

////////////////////////////////
// Key Inputs

window.addEventListener("keydown", (e) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      player.velocity.x = -1;
      break;
    case "d":
      keys.d.pressed = true;
      player.velocity.x = 1;
      break;
    case "w":
      player.velocity.y = -5; // controls the jump height
      break;
    case "s":
      //   player.velocity.x = 1;
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
