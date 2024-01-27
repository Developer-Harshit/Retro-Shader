precision mediump float;
uniform vec2 resolution;
uniform sampler2D utex0;
uniform float time;

const float scanOpacity = 0.3;
const float scanShape = 5.2;
const float bloomFactor = 0.3;
const float vigFactor = 0.15;
const float mixFactor = 0.4;
const float deformFactor = 2.9;
const float chromoFactor = 0.013;
const float chromoOffset = 0.002;

vec2 curve(vec2 uv) {
  uv = (uv - 0.5) * 2.0;
  uv *= 1.1;
  uv.x *= 1.0 + pow((abs(uv.y) / deformFactor), 3.0);
  uv.y *= 1.0 + pow((abs(uv.x) / (deformFactor * 0.7)), 3.0);
  uv = (uv / 2.0) + 0.5;
  uv = uv * 0.92 + 0.04;
  return uv;
}

void main() {

  vec2 q = gl_FragCoord.xy / resolution;
  vec2 uv = q;

  // flipping y axis
  uv.y = 1.0 - uv.y;
  uv = curve(uv);

  vec3 oricol = texture2D(utex0, uv).xyz;
  vec3 col;

  // color abbrebation
  float x = sin(0.21 * time + uv.y * 21.0) * sin(0.73 * time + uv.y * 29.0) * sin(0.3 + 0.6 * time + uv.y * 31.0) * chromoFactor;
  float y = cos(0.21 * time + uv.y * 21.0) * cos(0.73 * time + uv.y * 29.0) * cos(0.3 + 0.6 * time + uv.y * 31.0) * chromoFactor * 0.8;
  col.r = texture2D(utex0, vec2(x + uv.x, x + uv.y + chromoOffset)).x;
  col.g = texture2D(utex0, vec2(y + uv.x, y + uv.y)).y;
  col.b = texture2D(utex0, vec2(x + uv.x, x + uv.y - chromoOffset)).z;

  col = clamp(col * 0.6 + 0.4 * col * col * 1.0, 0.0, 1.0);

  // Scans
  float scans = clamp(0.0 + scanOpacity * sin(1.5 * time + uv.y * resolution.y * scanShape), 0.0, 1.0);
  float s = pow(scans, 1.2);
  col *= vec3(0.6 + 0.5 * s);

  // blink
  col *= 1.2 + 0.03 * sin(110.0 * time);

  // handling edges
  if (uv.x < 0.0 || uv.x > 1.0) {
    col *= 0.0;
    oricol *= 0.0;
  }
  if (uv.y < 0.0 || uv.y > 1.0) {
    col *= 0.0;
    oricol *= 0.0;

  }
  // fixing colors
  col *= 1.0 - 0.65 * vec3(clamp((mod(q.x, 2.0) - 1.0) * 2.0, 0.0, 1.0));

  // mixing original and computed colors
  col = mix(col, oricol, mixFactor);

  // Vignette
  float vig = (0.0 + 1.0 * 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y));
  col *= vec3(pow(vig, vigFactor * 1.5));

  // bloom
  col += bloomFactor * col * col * col;

  gl_FragColor = vec4(col, 1.0);

}