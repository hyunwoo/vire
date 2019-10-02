precision highp float;

#define PI 3.1415926535897932384626433832795
#define HALF_PI 1.5707963268

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform float playback;
uniform float flowSpeed;
uniform float flowHeight;

attribute vec3 position;
attribute vec4 color;
attribute vec3 size;

varying vec4 vColor;

vec3 mod289(vec3 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 mod289(vec4 x)
{
  return x-floor(x*(1./289.))*289.;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.)+1.)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159-.85373472095314*r;
}

vec3 fade(vec3 t){
  return t*t*t*(t*(t*6.-15.)+10.);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0=floor(P);// Integer part for indexing
  vec3 Pi1=Pi0+vec3(1.);// Integer part + 1
  Pi0=mod289(Pi0);
  Pi1=mod289(Pi1);
  vec3 Pf0=fract(P);// Fractional part for interpolation
  vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz;
  vec4 iz1=Pi1.zzzz;
  
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);
  vec4 ixy1=permute(ixy+iz1);
  
  vec4 gx0=ixy0*(1./7.);
  vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);
  gy0-=sz0*(step(0.,gy0)-.5);
  
  vec4 gx1=ixy1*(1./7.);
  vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);
  gy1-=sz1*(step(0.,gy1)-.5);
  
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;
  g010*=norm0.y;
  g100*=norm0.z;
  g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;
  g011*=norm1.y;
  g101*=norm1.z;
  g111*=norm1.w;
  
  float n000=dot(g000,Pf0);
  float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
  float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
  float n111=dot(g111,Pf1);
  
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2*n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P,vec3 rep)
{
  vec3 Pi0=mod(floor(P),rep);// Integer part, modulo period
  vec3 Pi1=mod(Pi0+vec3(1.),rep);// Integer part + 1, mod period
  Pi0=mod289(Pi0);
  Pi1=mod289(Pi1);
  vec3 Pf0=fract(P);// Fractional part for interpolation
  vec3 Pf1=Pf0-vec3(1.);// Fractional part - 1.0
  vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
  vec4 iy=vec4(Pi0.yy,Pi1.yy);
  vec4 iz0=Pi0.zzzz;
  vec4 iz1=Pi1.zzzz;
  
  vec4 ixy=permute(permute(ix)+iy);
  vec4 ixy0=permute(ixy+iz0);
  vec4 ixy1=permute(ixy+iz1);
  
  vec4 gx0=ixy0*(1./7.);
  vec4 gy0=fract(floor(gx0)*(1./7.))-.5;
  gx0=fract(gx0);
  vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
  vec4 sz0=step(gz0,vec4(0.));
  gx0-=sz0*(step(0.,gx0)-.5);
  gy0-=sz0*(step(0.,gy0)-.5);
  
  vec4 gx1=ixy1*(1./7.);
  vec4 gy1=fract(floor(gx1)*(1./7.))-.5;
  gx1=fract(gx1);
  vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
  vec4 sz1=step(gz1,vec4(0.));
  gx1-=sz1*(step(0.,gx1)-.5);
  gy1-=sz1*(step(0.,gy1)-.5);
  
  vec3 g000=vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100=vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010=vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110=vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001=vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101=vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011=vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111=vec3(gx1.w,gy1.w,gz1.w);
  
  vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000*=norm0.x;
  g010*=norm0.y;
  g100*=norm0.z;
  g110*=norm0.w;
  vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001*=norm1.x;
  g011*=norm1.y;
  g101*=norm1.z;
  g111*=norm1.w;
  
  float n000=dot(g000,Pf0);
  float n100=dot(g100,vec3(Pf1.x,Pf0.yz));
  float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110=dot(g110,vec3(Pf1.xy,Pf0.z));
  float n001=dot(g001,vec3(Pf0.xy,Pf1.z));
  float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011=dot(g011,vec3(Pf0.x,Pf1.yz));
  float n111=dot(g111,Pf1);
  
  vec3 fade_xyz=fade(Pf0);
  vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2*n_xyz;
}

float turbulence(vec3 p){
  float w=100.;
  float t=-.5;
  for(float f=1.;f<=10.;f++){
    float power=pow(2.,f);
    t+=abs(pnoise(vec3(power*p),vec3(10.,10.,10.))/power);
  }
  return t;
}
float rand(vec2 co){
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}
void main(){
  
  // vUv=uv;
  float t=time*.5;
  float ratio=max(min(playback*2.-1.+(position.x+900.)*.001,1.),0.);
  float revRatio=1.-ratio;
  // float displacement=-noise+b;
  vec3 noisePosition=vec3(
    revRatio*flowHeight*pnoise(.05*position.xyz+vec3(t*flowSpeed),vec3(25.)),
    revRatio*flowHeight*pnoise(.05*position.yxz+vec3(t*flowSpeed),vec3(5.)),
    revRatio*flowHeight*pnoise(.05*position.zyx+vec3(t*flowSpeed),vec3(15.)))*20.*(1.-ratio);
    
    // vec3 newPosition=position*displacement;
    // gl_Position=projectionMatrix*modelViewMatrix*vec4(newPosition,1.);
    // vec3 pos=position;
    
    vec4 c=color;
    c.a=c.a*ratio;
    vColor=c;
    vec3 pos=position+noisePosition;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
    gl_PointSize=1.*size.x;
  }
  