window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 1600;
  canvas.height = 720;
  let enemies = []; // set enemies to an empty array

  // Score tracker
  let score = 0;
  let gameOver = false;

  // class to handle input from users
  class InputHandler {
    constructor() {
      this.keys = []; // use an array to keep track of multiple key presses
      // there is a reason as to why we use arrow function instead of function (e)
      // Lexical scoping.
      window.addEventListener("keydown", (e) => {
        // if indexOf(e.key) === -1, it means that the element is not present inside the array
        // TODO: include movement using WASD keys
        // TODO: Attack buttons using space
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowRight" ||
            e.key === "ArrowLeft") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
        // console.log("key down " + e.key, this.keys);
      });

      // take note when they key pressed has been lifted
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowLeft"
        ) {
          // remove the key up from the array using splice and indexOf method
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
        // console.log("key up " + e.key, this.keys);
      });
    }
  }
  const input = new InputHandler();

  class Player {
    // gameWidth and gameHeight to ensure the player character remains within the canvas boundaries
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      // sprite sheet size
      this.width = 200; // sprite width
      this.height = 200; // sprite height
      this.x = 0;
      this.y = 520;
      this.image = document.getElementById("playerImage");
      this.frameX = 0; // the frame within the sprite sheet
      this.frameY = 0;
      this.maxFrame = 8; // since we have 8 horizontal frames

      this.fps = 20; // sets how fast we switch between different enemy frames. for this particular sprite sheet, it meant for 20 fps
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;

      this.speed = 0; // positive will move the sprite right, negative left. this value is changed in the update() method
      this.velocityY = 0;
      this.gravity = 1;
    }
    // specify which context we want to draw on. in case future changes involve multiple canvas contexts
    draw(context) {
      // position x and y of sprite in the context. Width and height of the sprite
      //   context.fillRect(this.x, this.y, this.width, this.height);

      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight). image, dx, dy are compulsory parameters. the rest are optional
      context.drawImage(
        this.image,
        this.frameX * this.width, // change the value of frameX and frameY to change to different sprite within the sprite sheet to animate movement
        this.frameY * this.height, // this.width and this.height remains fixed since the sprite size is the same
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, enemies) {
      // collision detection with enemy sprite
      enemies.forEach((enemy) => {
        const dx = enemy.x + enemy.width / 2 - (this.x + this.width / 2); // distance between the x position of player and enemy
        const dy = enemy.y + enemy.width / 2 - (this.y + this.height / 2); // distance between the y position of player and enemy
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < enemy.width / 2 + this.width / 2) {
          gameOver = true;
        }
      });

      // sprite animation FPS
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame)
          this.frameX = 0; // reset frameX to 0 if it reaches to the max of available sprite frames
        else {
          this.frameX++; // let the frameX go to the next available frame
          this.frameTimer = 0;
        }
      } else {
        this.frameTimer += deltaTime; //
      }

      // Controls
      if (input.keys.indexOf("ArrowRight") > -1) {
        // if input of arrowkey exist, it's index will not be -1
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
        console.log(this.x);
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.velocityY -= 22;
      } else {
        this.speed = 0;
      }

      // Horizontal movement
      this.x += this.speed;

      if (this.x < 0) {
        this.x = 0; // limits movement in the x-direction to the left.
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width; // limits movement in the x-direction to the right
      }
      // Vertical movement
      this.y += this.velocityY;
      // If player character is not on the ground, allow the idea of gravity pulling him down
      if (this.onGround() === false) {
        this.velocityY += this.gravity;
        this.maxFrame = 5; // since the bottom row of the sprite sheet only got 5 frames for the jumping
        this.frameY = 1; // change the sprite to jumping frame which is the bottom row 1
      } else {
        this.velocityY = 0; // limit movement in the y-direction.
        this.maxFrame = 8; // since the running animation has 8 frames
        this.frameY = 0; // reset frame to on the ground
      }
      // to further limit movement in the y-direction after jumping too high, and causing the character to partially go lower than the ground
      if (this.y > this.gameHeight - this.height) {
        this.y = this.gameHeight - this.height;
      }
    }
    // To check if player is on the ground
    onGround() {
      return this.y >= this.gameHeight - this.height; // returns a boolean true or false if player character on the ground
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameWidth = gameHeight;
      this.image = document.getElementById("backgroundImage");
      this.x = 0;
      this.y = 0;
      this.width = 2400; // dimensions of the background
      this.height = 720; // dimensions of the background
      this.speed = 20; // speed here is to determine the background movement by # of pixels
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.x + this.width,
        this.y,
        this.width - this.speed, // this is to account for the gap in between 2 different images
        this.height
      );
    }
    update() {
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        // reset and replay the background once it ends
        this.x = 0;
      }
    }
  }

  class Enemy {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      // sprite character dimensions from sprite sheet
      this.width = 160;
      this.height = 119;
      this.image = document.getElementById("enemyImage");
      this.x = this.gameWidth; // enemy appear from the left
      this.y = this.gameHeight - this.height; // vertical coordinate
      this.frameX = 0;
      this.speed = 8; // speed of enemy object

      this.maxFrame = 5; // enemy sprite sheet only got 5 frames
      this.fps = 20; // sets how fast we switch between different enemy frames. for this particular sprite sheet, it meant for 20 fps
      this.frameTimer = 0;
      this.frameInterval = 1000 / this.fps;
      this.markedForDeletion = false;
    }
    draw(context) {
      // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight). image, dx, dy are compulsory parameters. the rest are optional
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0, // sy = 0 since sprite sheet only got 1 row
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) {
          this.frameX = 0; // reset frameX to 0
        } else {
          this.frameX++;
          this.frameTimer = 0; // reset frameTimer to 0
        }
      } else {
        this.frameTimer += deltaTime; // else keep adding deltaTime to frameTimer until the threshold of frameInterval is reached
      }
      this.x -= this.speed;
      if (this.x < 0 - this.width) {
        this.markedForDeletion = true; // once enemy passes the left of x-axis, set it to be marked for deletion
        // Points added when enemy passes to the left of canvas
        score++;
      }
    }
  }

  // Function to generate enemies
  function handleEnemies(deltaTime) {
    if (enemyTimer > enemyInterval + randomEnemyInterval) {
      // Instantiating enemy objects and pushing them into an array
      enemies.push(new Enemy(canvas.width, canvas.height)); // instantiate enemy object
      console.log(enemies);
      enemyTimer = 0; // reset enemyTimer to 0
    } else {
      enemyTimer += deltaTime; // else, keep incrementing enemyTimer by the delta time till the enemy Interval is reached
      // incrementing as above helps to ensure that regardless of the computer (either fast or slow), the enemy object objet generated is the same
      // faster comp will have lower deltatime since the loop runs faster, hence will need more loops to accumulate the timer
    }
    enemies.forEach((enemy) => {
      enemy.draw(ctx);
      enemy.update(deltaTime); // making sure that enemy is updated per delta time
    });

    // update the enemy array and remove enemy objects that have gone past the screen x-axis
    enemies = enemies.filter((enemy) => !enemy.markedForDeletion); //
  }

  ////////////////////////////////////////////////////////////////
  // Display Status Text
  ////////////////////////////////////////////////////////////////

  function displayStatusText(context) {
    context.fillStyle = "black";
    context.font = "40px Helvetica";
    // READ: fillText(text, x coord, y coord)
    context.fillText("score: " + score, 20, 50);
    if (gameOver) {
      context.textAlign = "center";
      context.fillStyle = "black";
      context.fillText(
        "GAME OVER, try again!",
        canvas.width / 2,
        canvas.height / 2
      );
      context.fillStyle = "white";
      context.fillText(
        "GAME OVER, try again!",
        canvas.width / 2,
        canvas.height / 2 + 2
      );
    }
  }

  // All the width for the player, background and enemy objects are set by the canvas dimensions
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);
  const enemy1 = new Enemy(canvas.width, canvas.height);

  let lastTime = 0;

  //  Setting up the timer for enemy spawns
  let enemyTimer = 0;
  let enemyInterval = 2000; // setting the interval on how many seconds before enemy object is spawned
  let randomEnemyInterval = Math.random() * 1000 + 500; // randomly set the interval between 500 - 1500 ms

  function animate(timeStamp) {
    // FPS
    const deltaTime = timeStamp - lastTime;
    // timeStamp is available in requestAnimationFrame
    lastTime = timeStamp; // set the timeStamp to lastTime and use this value as parameter for the animate() function
    // console.log(deltaTime);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx); // need to draw background first before drawing the player character
    background.update();

    player.draw(ctx);
    player.update(input, deltaTime, enemies);

    // enemy1.draw(ctx); // call this inside the handleEnemies function to generate constant stream of enemy objects
    // enemy1.update();
    handleEnemies(deltaTime); // use deltaTime to trigger enemies
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
  }
  animate(0); // set parameter for timeStamp to 0 for the first time running this animate loop
});
