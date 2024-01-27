import { Renderer } from "./scripts/renderer";
window.onload = () => {
  const renderer = new Renderer(document.getElementById("c"));
  const img = document.createElement("img");
  img.src = "/sample.jpg";
  const ctx = renderer.get_ctx();

  let h = ctx.canvas.height * 2;

  renderer.init();

  // dt = ? , fps = 60 ; frame b/w dt = 1 ; 1/60 s * 1000
  setInterval(draw, 100 / 1);
  function draw() {
    renderer.render();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = "900 100px monospace";

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeText("Not Found", 10, h + 70);
    ctx.strokeText("404", 10, h);

    ctx.fillStyle = "white";
    ctx.fillText("Not Found", 10, h + 70);
    ctx.fillText("404", 10, h);
  }
};
