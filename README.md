# Project-Zombie-Mario

Simple 2D platformer game
try it here! https://project-zombie-mario.vercel.app/

Hack and slash the skeleton zombies before the timer runs out to win!  
Don't get hit by them or it's **GAMEOVER**

![Screenshot](screenshots/MainGame.png?raw=true)

## Game Controls

Use the following buttons for movement in-game:

**W**: Up  
**A**: Left  
**D**: Right  
**Enter**: Attack

## Approaching the Game

Building a 2D game from scratch was definitely not an easy task. But thankfully, there are numerous resources available onlne that goes through on how to build up a 2D platform game from scratch with vanilla JS.

Links to a few great resources are:

- Tutorial on understanding how to use [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) in HTML5.
- Simple Javascript game [tutorial](https://www.youtube.com/watch?v=bG2BmmYr9NQ&ab_channel=KnifeCircus)
- Collision Detection [tutorial](https://www.youtube.com/watch?v=_MyPLZSGS3s&ab_channel=ChrisCourses)
- How to use [Tiled](https://www.youtube.com/watch?v=IHmF_bRpOAE&ab_channel=Challacade) Map Editor
- Plaformer game [tutorial](https://www.youtube.com/watch?v=rTVoyWu8r6g&t=8183s&ab_channel=ChrisCourses)
- Fighting game [tutorial](https://www.youtube.com/watch?v=vyqbNFMDRGQ&ab_channel=ChrisCourses)

When building this game, I had the simple objective that the overall MVP was a game where players can move around and attack enemies, reminiscence of old school platformers and side-scroller games such as Super Mario World and Sonic.

Following that, other things can come into play such as coins, power-ups and so on.

Knowing what you want to have, the general approach to the game was to building up movements of a player character, how the character interacts with the environment such as running on solid blocks, jumping onto platforms. Following that, was the creation of enemies, and how the player interacts with enemies. Once the enemies are created, I then focused on how the player attacks the enemies, and to have end-game scenario, was the time element in the game where players need to defeat the enemies under a specified time.

## Challenges

Since this is my first attempt at building a game, it has been challenging but fun experience.

One of the most crucial things that I needed to understand was the whole idea was that fundamentally, 2D platform games are simply just blocks that are moving in two-axes, x and y. How we position them and move them is by translating them in these directions. From there, interactions between them can be triggered by recognising that they are "colliding" with each other.

### 1. Collision blocks

If you look through the codes in the utils.js, you will see that it showcases the collision checks between player and the environment. The checks are to see if there any intersections between the player blocks and the environment. We are checking if their axes added with their height and width, and overlapping with each other.

```
function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y && // bottom player intersecting top of CB
    object1.position.y <= object2.position.y + object2.height && // top of player intersecting bottom of CB
    object1.position.x <= object2.position.x + object2.width && // left of player intersecting right of CB
    object1.position.x + object1.width >= object2.position.x // right of player intersecting left of CB
  );
}
```

Object 1 and Object 2 are simply different objects that have positions x and y, and their own respective width and height. It was a challenge to wrap my mind on the types of checks that I needed to do in order to simulate on how and what do we want to check for. It took some time, but I a great trick to solving this was to simply draw out these blocks and provide arbirtary coordinates. Do take note that the canvas coordinate system is a little different from how we usually do it in math. The (x,y) position with (0,0) is actually at the top left, and the values goes positive as we move in the horizontally right and vertically down directions.

Once I was able to fully grasp these concepts, it was very straight forward to setup how player collisions with enemies, how player jumping onto platforms from below and how players player attacks can interact with enemies. In this game, these interaction of player and other enemy objects are done via "hitboxes".

### 2. Creating classes

In developing the game, I realised how over time, as I tried to add more functions for the player character to be able to interact with the environment, these changes forced me to make more modifications to the Player class. From my own vision on what the character is supposed to do, it slowly translated to additional functions within the class. For example, the Player class began with simple positions (x,y) of player, and it's width and height. Slowly, as, movement, hitboxes, collision checks, attacks and animation was added, the Player class became more and more complicated.

It helps to reinforce the idea of incremental updates over time as we build on functions, we need to keep it simple and reusable. Chunks of code that are repeated should be refactored to keep things DRY.

## Interesting Codes

1. Creating collision blocks in the environment

```
const floorCollisions = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 202, 202, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 202, 202,
  202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202,
  202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202, 202,
  202, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
```

In the collisions.js file, you will find a 1D array that have 0s and some unique values, such as 202 in the example above. These are actually arrays that are generated when we create the game map and exported them using the application [Tiled](https://www.mapeditor.org/).

![Tiled-Map](screenshots/tiledMap.png?raw=true)

These values help to generate the blocks in the game. The general approach was to convert these arrays to 2D arrays instead through slicing. From there, we are able to generate the x & y position of these blocks and with their width and height, draw out these blocks as objects (refer to collisionBlocks.js on how these properties are used in the collisionBlock class).

## Possible areas of improvement

Given more time, there are definitely more things that I would like to have added and improved on in this game.

- Creating movement for enemies
- Adding power-ups such as speed (increasing velocity when a player touches the power-up) or bombs (clearing enemies from the enemyArray to simulate mass clearing of enemies)
- Adding different game-modes (manipulating amount of time to clear a level, and number of enemies generated in-game)

## Credits

Game assets used:

- [Adventurer Sprite](https://rvros.itch.io/animated-pixel-hero)
- [Forest Map Sprite Pack](https://anokolisa.itch.io/high-forest-assets-pack)
- [Battle Sound](https://www.youtube.com/watch?v=nSSNMRHwWiA&list=PLrCag3iuaIvPfSTRdBqQqzhywA-FMoJ4W&index=3&ab_channel=lastcn)
- [Victory Sound](https://www.youtube.com/watch?v=xVPWVD99m6o&list=PLrCag3iuaIvPfSTRdBqQqzhywA-FMoJ4W&index=4&ab_channel=lastcn)
- [Sword slash](https://www.youtube.com/watch?v=BQV5rbBMjCQ&ab_channel=CPhTFluke)
