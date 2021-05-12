(function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  //get the textures from the local storage
  const textures = JSON.parse(localStorage.getItem("textures"));
  //filter landscape and portrait frames from the array
  const landscapeFrames = textures.frames.filter((frame) =>
    frame.filename.includes("landscape")
  );
  const portraitFrames = textures.frames.filter((frame) =>
    frame.filename.includes("portrait")
  );
  //setting initial global alpha
  let ga = 1;

  let bgImage = new Image();
  let frames = [];
  let bgw = 0;
  let bgh = 0;
  let sprites = [];

  initialize();

  function initialize() {
    window.addEventListener("resize", resizeCanvas, false);
    window.addEventListener("load", resizeCanvas, false);
    //fetch frames info from the json file and store it into local storage
    fetch("assets/backgroundAnim.json")
      .then((res) => res.json())
      .then((res) => {
        let textures = res.textures[0];
        localStorage.setItem("textures", JSON.stringify(textures));
      });
    setInterval(redraw, 200);
    resizeCanvas();
  }

  function redraw() {
    //draw the background image
    context.drawImage(bgImage, 0, 0, bgw, bgh);
    //loop through the filtered frames array and draw sprites
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      context.globalAlpha = ga;
      sprites[i] = new Image();
      sprites[i].src = `assets/${textures.image}`;
      context.save();

      context.drawImage(
        sprites[i],
        frame.frame.x,
        frame.frame.y,
        frame.frame.w,
        frame.frame.h,
        frame.spriteSourceSize.x,
        frame.spriteSourceSize.y,
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
    //set the background and few other variables based on the screen width
    if (window.screen.width > 900) {
      bgImage.src = `assets/main-bg.png`;
      frames = [...landscapeFrames];
      bgw = 922;
      bgh = 518;
    } else {
      bgImage.src = `assets/main-bg-portrait.png`;
      frames = [...portraitFrames];
      bgw = 518;
      bgh = 922;
    }
    redraw();
  }
})();
