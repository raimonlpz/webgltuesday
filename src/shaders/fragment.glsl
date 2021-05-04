precision mediump float;

uniform sampler2D uTexture;
uniform float uWavingDensity;

varying vec2 vUv;
varying float vTime;

void main(){
    vec2 wavedUv=vec2(
        vUv.x+sin(vUv.y*10.+vTime)*uWavingDensity,
        vUv.y+sin(vUv.x*10.+vTime)*uWavingDensity
    );
    
    vec4 textureColor=texture2D(uTexture,wavedUv);
    gl_FragColor=textureColor;
}