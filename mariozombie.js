window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 720;

  // class to handle input from users
  class InputHandler {
    constructor() {
      this.keys = []; // use an array to keep track of multiple key presses
      // there is a reason as to why we use arrow function instead of function (e)
      // Lexical scoping.
      window.addEventListener("keydown", (e) => {
        // if indexOf(e.key) === -1, it means that the element is not present inside the array
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowRight" ||
            e.key === "ArrowLeft") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
        console.log("key down " + e.key, this.keys);
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
        console.log("key up " + e.key, this.keys);
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
      this.y = 0;
      this.image = document.getElementById("playerImage");
      this.frameX = 0; // the frame within the sprite sheet
      this.frameY = 0;
      this.speed = 0; // positive will move the sprite right, negative left. this value is changed in the update() method
    }
    // specify which context we want to draw on. in case future changes involve multiple canvas contexts
    draw(context) {
      context.fillStyle = "white"; // background set to white for visibility
      // position x and y of sprite in the context. Width and height of the sprite
      context.fillRect(this.x, this.y, this.width, this.height);
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
    update(input) {
      // takes in the input object to update the player movement
      this.x += this.speed;
      // if input of arrowkey exist, it's index will not be -1
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 5;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -5;
        console.log(this.x);
      } else {
        this.speed = 0;
      }
      if (this.x < 0) {
        this.x = 0; // limits movement in the x-direction to the left.
      } else if (this.x > this.gameWidth - this.width) {
        this.x = this.gameWidth - this.width; // limits movement in the x-direction to the right
      }
    }
  }

  const player = new Player(canvas.width, canvas.height);
  player.draw(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw(ctx);
    player.update(input);
    requestAnimationFrame(animate);
  }
  animate();
});
