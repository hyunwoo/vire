import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup } from '../base';
import PointObject from './pointObject';
import { PointProperties, PointDefinition } from './index';
import { Vector3 } from 'three';
import { PointGroupType, PointGroupTypeTextures } from './pointGroupType';

// TODO BufferGroup에 대한 재정의가 필요하다.



export default class PoingGroup
  extends RenderGroup<PointProperties, PointObject> {
  // private material: THREE.Material;
  // protected geometry!: THREE.BufferGeometry;

  private readonly defaultTextureURL = '/texture/circle_32.png';
  private texture: THREE.Texture | undefined;

  public constructor(scene: THREE.Scene, count: number) {
    super(scene, PointDefinition,
      THREE.BufferGeometry,
      THREE.Points);

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 },
        texture: { value: this.texture }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    this.initializeAttributes(count, PointDefinition.unitVertCount);
    this.applyMaterial(material);
    this.createObjects(PointObject);
    this.props.color.fill(1);
    this.props.position.fill(0);
    this.props.size.fill(1);
    this.setType('rect');
  }



  public setType(type: keyof PointGroupType) {
    const url = PointGroupTypeTextures[type];
    if (this.texture) {
      this.texture.dispose();
      this.texture = undefined;
    }
    this.texture = new THREE.TextureLoader().load(url);
    this.texture.generateMipmaps = true;
    const mat = (this.material as THREE.RawShaderMaterial);
    mat.uniforms.texture.value = this.texture;
  }



  public onRender() {
    // TODO
  }

  public onUpdate() {
    const mat = (this.material as THREE.RawShaderMaterial);
    // mat.uniforms.cameraPosition.value = this.camera.position;
    // TODO
  }
}
