precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
attribute vec3 instancePosition;
attribute vec2 instanceUV;
attribute vec3 instnaceNormal;
attribute vec3 position;
attribute vec3 size;
attribute vec4 rotation;
attribute vec4 color;
varying vec2 vUv;
varying vec4 vColor;

vec3 applyQuaternionToVector(vec4 q,vec3 v){
  return v+2.*cross(q.xyz,cross(q.xyz,v)+q.w*v);
}

void main(){
  vec4 unitPosition=modelViewMatrix*vec4(position,1.);
  vec3 iPos=applyQuaternionToVector(rotation,instancePosition);
  unitPosition.xyz+=iPos*size;
  vColor=color;
  vUv=instanceUV;
  gl_Position=projectionMatrix*unitPosition;
}