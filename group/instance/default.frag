precision highp float;
uniform sampler2D map;
varying vec2 vUv;
varying vec4 vColor;
// HSL to RGB Convertion helpers
vec3 HUEtoRGB(float H){
  H=mod(H,1.);
  float R=abs(H*6.-3.)-1.;
  float G=2.-abs(H*6.-2.);
  float B=2.-abs(H*6.-4.);
  return clamp(vec3(R,G,B),0.,1.);
}
vec3 HSLtoRGB(vec3 HSL){
  vec3 RGB=HUEtoRGB(HSL.x);
  float C=(1.-abs(2.*HSL.z-1.))*HSL.y;
  return(RGB-.5)*C+HSL.z;
}
void main(){
  // vec4 diffuseColor=texture2D(map,vUv);
  // vec4 diffuseColor=vec4(1,1,1,1);
  gl_FragColor=vColor;
  if(vColor.w<.5)discard;
}