precision highp float;
uniform float sineTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 position;
attribute vec3 translate;
attribute vec4 color;
attribute vec3 pivot;
attribute float rotate;
// varying vec3 vPosition;
varying vec4 vColor;

// http://www.geeks3d.com/20141201/how-to-rotate-a-vertex-by-a-quaternion-in-glsl/
vec3 applyQuaternionToVector(vec4 q,vec3 v){
  return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);
}

void main(){
  // vec3 pos=translate+applyQuaternionToVector(rotation,position*scale);
  vec3 pos=translate+position;
  vColor=color;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}
