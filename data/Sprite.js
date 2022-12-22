////////////////////////////////
// Sprite Class
class Sprite {
  constructor({
    position,
    imageSrc,
    frameRate = 1,
    frameBuffer = 3,
    scale = 1,
  }) {
    this.position = position;
    this.image = new Image();
    this.loaded = false; // set to false that image has been loaded
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true; // set to true that image has been loaded
    };
    this.image.src = imageSrc;

    // Properties for sprite animation
    this.frameRate = frameRate;
    this.currentFrame = 0; // current frame is used to track on the frame that is displayed

    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0; // specifies how many frames have elapsed. set default to 0 when instantiated

    // scale
    this.scale = scale;
  }

  draw() {
    // crop the sprite image
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate, // since the frame rate of sprite is 8
      height: this.image.height,
    };

    ctx.drawImage(
      this.image,
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  updateFrames() {
    this.elapsedFrames++;

    // this if statement is to delay the sprite animation. instead of updating at every frame,
    // instead, after a few loops, when the elapsed frames % frame buffer is 0, then only will we update the current frame to the next one
    if (this.elapsedFrames % this.frameBuffer === 0)
      if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
      else this.currentFrame = 0;
  }

  update() {
    this.draw();
    this.updateFrames();
  }
}
