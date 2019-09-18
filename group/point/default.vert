precision highp float;
uniform float sineTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec4 color;
// varying vec3 vPosition;
varying vec4 vColor;

void main(){
  vColor=color;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  gl_PointSize=3.;
}
