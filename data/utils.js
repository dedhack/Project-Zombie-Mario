function collision({ object1, object2 }) {
  return (
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y <= object2.position.y + object2.height &&
    object1.position.x <= object2.position.x + object2.width &&
    object1.position.x + object1.width >= object2.position.x
  );
}

function platformCollision({ object1, object2 }) {
  return (
    // README: Difference is that the second check is to ensure that the bottom of the player character is above the platform collision box before the player is on top
    // Eliminates the issue where the area of player hitbox goes through the platform partially but gets transported to the top of the platform
    object1.position.y + object1.height >= object2.position.y &&
    object1.position.y + object1.height <=
      object2.position.y + object2.height &&
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

// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Game_over
function restartGame() {
  const restartBtn = document.getElementById("restart");
  restartBtn.style.display = "flex";
  restartBtn.addEventListener("click", () => document.location.reload());
}

function endGame(collision) {
  if (score === 10) {
    clearTimeout(timerId);
    document.querySelector("#results").innerHTML = "YOU WIN";
    document.querySelector("#results").style.display = "flex";
    window.cancelAnimationFrame(reqAnim);
    restartGame();
  } else if ((timer === 0 && score < 10) || collision === true) {
    clearTimeout(timerId);
    document.querySelector("#results").innerHTML = "GAMEOVER";
    document.querySelector("#results").style.display = "flex";
    window.cancelAnimationFrame(reqAnim);
    restartGame();
  }
}

function decreaseTimer() {
  timerId = setTimeout(decreaseTimer, 1000); // 1000 milliseconds or 1 second
  if (timer > 0) {
    timer--;
    document.querySelector("#timer").innerHTML = "TIME: " + timer;
  }
  endGame();
}
decreaseTimer();
