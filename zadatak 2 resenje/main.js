(function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  //get the frames from the local storage and filter smalStars
  const frames = JSON.parse(localStorage.getItem("textures")).filter((frame) =>
    frame.filename.includes("small")
  );
  //setting initial global alpha
  let ga = 1;

  let bgImage = new Image();
  let sprites = [];

  initialize();

  function initialize() {
    window.addEventListener("resize", resizeCanvas, false);
    window.addEventListener("load", resizeCanvas, false);
    //fetch frames info from the json file and store it into local storage
    fetch("assets/star.json")
      .then((res) => res.json())
      .then((res) => {
        let frames = res.frames;
        localStorage.setItem("textures", JSON.stringify(frames));
      });
    setInterval(redraw, 500);
    resizeCanvas();
  }

  function redraw() {
    //draw the background image
    context.drawImage(bgImage, 0, 0, window.innerWidth, window.innerHeight);
    //loop through the frames array and draw sprites on random canvas coordinates
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      context.globalAlpha = ga;
      sprites[i] = new Image();
      sprites[i].src = `assets/star.png`;
      context.save();

      context.drawImage(
        sprites[i],
        frame.frame.x,
        frame.frame.y,
        frame.frame.w,
        frame.frame.h,
        Math.floor(Math.random() * window.screen.width) + 1,
        Math.floor(Math.random() * window.screen.height) + 1,
        frame.frame.w,
        frame.frame.h
      );
      //fading starts by decriesing the global alpha and reseting if less than 0
      ga = ga - 0.3;
      if (ga <= 0.0) {
        ga = 1;
      }
      context.restore();
    }
  }

  function resizeCanvas() {
    //fill the window with canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //set the background based on the screen width
    if (window.screen.width > 900) {
      bgImage.src = `assets/main-bg.png`;
    } else {
      bgImage.src = `assets/main-bg-portrait.png`;
    }

    redraw();
  }
})();
