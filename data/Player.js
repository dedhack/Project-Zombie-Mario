////////////////////////////////
// Character Class
class Player {
  constructor({ position, collisionBlocks }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0.0001,
    };
    this.width = 100 / 4;
    this.height = 100 / 4; // divide by 4 due to scale
    this.collisionBlocks = collisionBlocks;
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.applyGravity();
    this.checkForVerticalCollisions();
  }

  applyGravity() {
    this.position.y += this.velocity.y;
    this.velocity.y += gravity; // increase velocity by adding gravity for each update() loop
  }
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i]; // create an array to store the floor collision blocks in that has been passed into the character object when instantiated
      if (collision({ object1: this, object2: collisionBlock })) {
        // set the velocity.y to zero if the value is non-zero and a collision has already occurred. Prevent character from passing through blocks
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          // to ensure that the player is positioned on top of the top of the collision block
          this.position.y = collisionBlock.position.y - this.height - 0.01; // TODO: -0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
        }
        // For collisions with the bottom of a collision block when player character is jumping
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01; // TODO: +0.01 to ensure that the block is not colliding anymore. will be used for horizontal collision check
        }
      }
    }
  }
}
