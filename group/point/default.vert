precision highp float;
uniform float sineTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;
attribute vec3 position;
attribute vec4 color;
attribute vec3 size;
// varying vec3 vPosition;
varying vec4 vColor;

void main(){
  vColor=color;
  
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  vec3 dist=gl_Position.xyz-cameraPosition;
  gl_PointSize=1.*size.x;
}
