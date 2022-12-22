function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y && // bottom player intersecting top of CB
    object1.position.y <= object2.position.y + object2.height && // top of player intersecting bottom of CB
    object1.position.x <= object2.position.x + object2.width && // left of player intersecting right of CB
    object1.position.x + object1.width >= object2.position.x // right of player intersecting left of CB
  );
}

function platformCollision({ object1, object2 }) {
  return (
    // README: Difference is that the second check is to ensure that the bottom of the player character is above the platform collision box before the player is on top
    // Eliminates the issue where the area of player hitbox goes through the platform partially but gets transported to the top of the platform
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <=
      object2.position.y + object2.height && // bottom of the player less than bottom of platform CB
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

function enemyCollision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}
