import vert from "../glsl/shader.vert?raw";
import frag from "../glsl/shader.frag?raw";
import {
  resizeCanvasToDisplaySize,
  createProgramInfo,
  createBufferInfoFromArrays,
  createTexture,
  setBuffersAndAttributes,
  setUniforms,
  drawBufferInfo,
} from "twgl.js";
export class Renderer {
  /**
   * @param {HTMLCanvasElement} cnv
   */
  constructor(cnv) {
    this.main = cnv;

    this.gl = cnv.getContext("webgl2", {
      antialias: false,
      depth: false,
    });
    this.surf = document.createElement("canvas");
    this.ctx = this.surf.getContext("2d");
    this.framecount = 0;
  }
  resize() {
    this.surf.width = this.gl.canvas.width;
    this.surf.height = this.gl.canvas.height;

    resizeCanvasToDisplaySize(this.gl.canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
  get_shaders() {
    return [vert, frag];
  }
  get_ctx() {
    return this.ctx;
  }
  async init() {
    this.program_info = createProgramInfo(this.gl, this.get_shaders());

    const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    this.buffer_info = createBufferInfoFromArrays(this.gl, arrays);
    this.resize();
  }
  render() {
    this.framecount += 1;
    const tex = createTexture(this.gl, { src: this.ctx.canvas });
    const uniforms = {
      time: this.framecount * 0.05,
      resolution: [this.gl.canvas.width, this.gl.canvas.height],
      utex0: tex,
    };

    this.gl.useProgram(this.program_info.program);
    setBuffersAndAttributes(this.gl, this.program_info, this.buffer_info);
    setUniforms(this.program_info, uniforms);
    drawBufferInfo(this.gl, this.buffer_info);
  }
}
