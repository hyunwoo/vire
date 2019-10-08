precision highp float;
uniform float time;
uniform sampler2D texture;
uniform bool useTexture;
// varying vec3 vPosition;
varying vec4 vColor;
void main(){
  vec4 color=texture2D(texture,gl_PointCoord);
  gl_FragColor=color*vColor;
  
}