precision highp float;
uniform float time;
// varying vec3 vPosition;
varying vec4 vColor;
void main(){
  // vec4 color=vec4(vColor);
  gl_FragColor=vColor;
}