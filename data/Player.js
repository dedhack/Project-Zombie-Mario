////////////////////////////////
// Character Class
class Player extends Sprite {
  constructor({
    position,
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc,
    frameRate,
    scale = 0.5,
    animations,
  }) {
    super({ imageSrc, frameRate, scale });
    this.position = position;
    this.velocity = {
      x: 0,
      y: 1,
    };

    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionBlocks;

    // hitbox dimensions that we will use for collision
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 10,
      height: 10,
    };

    this.animations = animations;
    this.lastDirection = "right";
    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imageSrc;

      this.animations[key].image = image;
    }
    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }
  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }
  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 50, // FIXME: play around with the value to center the camerabox to the player
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
  }
  shouldPanCameraToTheLeft() {
    const cameraBoxRightSide = this.camerabox.position.x + this.camerabox.width;

    // FIXME: Need to divide canvas.width by 4 due to the scale factor. Should make the scale factor a global variable
    if (cameraboxRightSide >= canvas.width / 4) {
      console.log("PanCameraToTheLeft");
    }
  }

  update() {
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    // draw out camerabox
    ctx.fillStyle = "rgba(0,0,255,0.2";
    ctx.fillRect(
      this.camerabox.position.x,
      this.camerabox.position.y,
      this.camerabox.width,
      this.camerabox.height
    );

    // draws out image box
    // ctx.fillStyle = "rgba(0,255,0,0.2";
    // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // // draw out hitbox
    // ctx.fillStyle = "rgba(255,0,0,0.2";
    // ctx.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );

    this.draw();

    this.position.x += this.velocity.x;
    this.updateHitbox(); // TODO: need to be placed before the checks to eliminate jitter. explain inside readme
    this.checkForHorizontalCollisions(); // TODO: need to run before the applyGravity(). else will be colliding with the collision blocks at the bottom
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }
  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: 14,
      height: 27,
    };
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ object1: this.hitbox, object2: collisionBlock })) {
        // movement to the right
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
        // movement to the left
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += gravity; // increase velocity by adding gravity for each update() loop
    this.position.y += this.velocity.y;
  }

  // Floor collision
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]; // create an array to store the floor collision blocks in that has been passed into the character object when instantiated
      if (collision({ object1: this.hitbox, object2: collisionBlock })) {
        // set the velocity.y to zero if the value is non-zero and a collision has already occurred. Prevent character from passing through blocks
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          // to ensure that the player is positioned on top of the top of the collision block
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = collisionBlock.position.y - offset - 0.01; // TODO: update on the this.height c-0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
          break;
        }
        // For collisions with the bottom of a collision block when player character is jumping
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01; // TODO: +0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
          break;
        }
      }
    }

    // Platform collision detection
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i]; // create an array to store the floor collision blocks in that has been passed into the character object when instantiated
      if (
        platformCollision({
          object1: this.hitbox,
          object2: platformCollisionBlock,
        })
      ) {
        // set the velocity.y to zero if the value is non-zero and a collision has already occurred. Prevent character from passing through blocks
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          // to ensure that the player is positioned on top of the top of the caollision block
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = platformCollisionBlock.position.y - offset - 0.01; // TODO: update on the this.height c-0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
          break;
        }
        // For collisions with the bottom of a collision block when player character is jumping
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          const offset = this.hitbox.position.y - this.position.y;

          this.position.y =
            platformCollisionBlock.position.y +
            platformCollisionBlock.height -
            offset +
            0.01; // TODO: +0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
          break;
        }
      }
    }
  }
}
