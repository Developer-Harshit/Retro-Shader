import { Renderer } from "./scripts/renderer";
function getRequestAnimationFrame() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (
      /* function FrameRequestCallback */ callback,
      /* DOMElement Element */ element
    ) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
}

window.onload = () => {
  const renderer = new Renderer(document.getElementById("c"));
  const img = document.createElement("img");
  img.src = "/sample.jpg";
  const ctx = renderer.get_ctx();

  let h = ctx.canvas.height * 2;

  const RAF = getRequestAnimationFrame();
  renderer.init();

  // dt = ? , fps = 60 ; frame b/w dt = 1 ; 1/60 s * 1000
  RAF(draw);
  let prevTime = 0;
  function draw(time) {
    // update time
    let dt = time - prevTime;
    prevTime = time;

    // draw bg
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // font settings
    ctx.font = "900 100px monospace";
    ctx.lineWidth = 1;

    // text 1
    ctx.strokeStyle = "black";
    ctx.strokeText("Retro", 10, h);
    ctx.strokeText(1000 / dt, 10, h + 70);

    // text 2
    ctx.fillStyle = "white";
    ctx.fillText("Retro", 10, h);
    ctx.fillText(1000 / dt, 10, h + 70);

    // rendering into renderer
    renderer.render();

    // raf
    RAF(draw);
  }
};
