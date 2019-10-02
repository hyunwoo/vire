import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup } from '../base';
import SmokeObject from './smokeObject';
import { SmokeProperties, SmokeDefinition } from './index';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';

// TODO BufferGroup에 대한 재정의가 필요하다.
type SmokePlaybackState = 'play' | 'reverse' | 'stop';

export default class SmokeGroup
  extends RenderGroup<SmokeProperties, SmokeObject> {
  // private material: THREE.Material;
  // protected geometry!: THREE.BufferGeometry;
  protected playback: number = 0;
  protected playbackState: SmokePlaybackState = 'stop';
  protected duration: number = 12;
  protected stateChange: (state: SmokePlaybackState) => void;


  public constructor(scene: THREE.Scene, count: number) {
    super(scene, SmokeDefinition,
      THREE.BufferGeometry,
      THREE.Points);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        playback: { value: 0.0 },
        flowSpeed: { value: 1.0 },
        flowHeight: { value: 4.0 },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    this.stateChange = () => { /** Emtpy */ };
    this.initializeAttributes(count, SmokeDefinition.unitVertCount);
    this.applyMaterial(material);
    this.createObjects(SmokeObject);
    this.props.color.fill(1);
    this.props.position.fill(0);
    this.props.size.fill(1);
    // const gpu: GPUComputationRenderer;
    // const a = gpu.addVariable()
  }





  public onRender() {
    // TODO
  }
  public set onStateChange(callback: (state: SmokePlaybackState) => void) {
    this.stateChange = callback;
  }

  public set state(state: SmokePlaybackState) {
    this.playbackState = state;
  }
  public get canChangeState() {
    return this.playbackState === 'stop';
  }
  public set animationDuration(duration: number) {
    this.duration = duration;
  }
  public setUniform(attribute: string, value: number) {
    const mat = (this.material as THREE.RawShaderMaterial);
    mat.uniforms[attribute].value = value;
  }
  public onUpdate(time: number, deltaTime: number) {
    const mat = (this.material as THREE.RawShaderMaterial);
    mat.uniforms.time.value = time;
    switch (this.playbackState) {
      case 'play':
        this.playback += deltaTime / this.duration;
        if (this.playback > 1) {
          this.playback = 1;
          this.playbackState = 'stop';
          this.stateChange(this.playbackState);
        }
        break;
      case 'reverse':
        this.playback -= deltaTime / this.duration;
        if (this.playback < 0) {
          this.playback = 0;
          this.playbackState = 'stop';
          this.stateChange(this.playbackState);
        }
        break;
    }

    mat.uniforms.playback.value = this.playback;


    // mat.uniforms.cameraPosition.value = this.camera.position;
    // TODO
  }
}
