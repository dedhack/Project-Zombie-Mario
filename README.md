# Project-Zombie-Mario

Mario faces evil zombies in the post apocalyptic Mushroom Kingdom

1. Player.js

- checkForHorizontalCollisions()

* check to see if the player touches the horizontal blocks
* under this.position.x, we add/subtract an additional 0.01 to ensure the player doesn't still trigger a collision in the x-axis
* add a break to break out of the loop to ensure we do not run the for loop unnecessarily when collision has already been detected in an earlier loop.

1a.  Player Class

* extends the Sprite class


- switchSprite()
* Explain the logic on how we switch between sprites. Include the update done in the movement event listener
* Explain the frameBuffer


2. CollisionBlock Class

3. Collisions.js

- array of floor blocks and platform blocks generated from the use of Tiled application

4. Sprite class

- position:
- imageSrc:
- frameRate = 1. By default we set it to 1 frame. This is to account for Sprite/images that only have 1 frame.

- animations:

- this.loaded = false. This is to check if the image is already loaded. This is checked in the Player object switch sprite function. 

- image onload(). we use the built-in onload function to check that once the image has loaded, then we pass the image width and height to the objects width and height
- frameRate - this is simply the number of frames that we have for a particular sprite that we want to loop through
- currentFrame - by default, we set this to 0 when instantiated. we want this to keep track of this and increment as we loop the sprite animation. we use its value to select the crop image in the sprite sheet
- frameBuffer and elapsedFrames


- cropbox

* cropbox position is in reference to the sprite sheet image
* x and y positions are referring to the sprite sheet's
* TODO: explain the x coordinate
* imagine the sprite sheet as an array
* for the x position, the currentFrame acts as the index, and we multiply this by the dimensions of each frame (i.e. this.image.width / this.frameRate)

- drawImage()

* explain the parameters that we pass through and why we do it as so

- update()

* this function is used to call the custom draw() function

- updateFrames()
* Function is used to loop the frames for the sprite sheet