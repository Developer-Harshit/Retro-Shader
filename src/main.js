import { Renderer } from "./scripts/renderer";

window.onload = () => {
  const renderer = new Renderer(document.getElementById("c"));
  const img = document.createElement("img");
  img.src = "/sample.jpg";

  const ctx = renderer.get_ctx();
  let x = 10;
  let y = 10;

  renderer.init();

  // dt = ? , fps = 60 ; frame b/w dt = 1 ; 1/60 s * 1000
  setInterval(draw, 100 / 1);

  function draw() {
    renderer.render();
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, y, 15, 10);
    if (renderer.framecount % 5 == 0) {
      x += 4;
      y += 4;
    }
  }
};
