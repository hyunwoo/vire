precision highp float;
uniform float time;
// varying vec3 vPosition;
varying vec4 vColor;
void main(){
  gl_FragColor=vColor;
  // gl_FragColor=vec4(1,1,1,1);
}