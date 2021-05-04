uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;
varying float vTime;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    
    modelPosition.z+=sin(modelPosition.x*7.+uTime)*(uMouse.x/uResolution.x*.9);
    modelPosition.x+=sin(modelPosition.z*7.+uTime)*(uMouse.y/uResolution.y*1.2);
    modelPosition.y+=sin(modelPosition.z*7.+uTime)*(uMouse.y/uResolution.y*.8);
    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vTime=uTime;
}