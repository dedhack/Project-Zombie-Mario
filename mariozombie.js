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
});
