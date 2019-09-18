import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup } from '../base';
import PointObject from './pointObject';
import { PointProperties, PointDefinition } from './index';

// TODO BufferGroup에 대한 재정의가 필요하다.



export default class PoingGroup
  extends RenderGroup<PointProperties, PointObject> {
  // private material: THREE.Material;
  // protected geometry!: THREE.BufferGeometry;

  public constructor(scene: THREE.Scene, count: number) {
    super(scene, PointDefinition,
      THREE.BufferGeometry,
      THREE.Points);

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 }
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
    console.log(this.props);
    this.props.color.fill(1);
    this.props.position.fill(0);
  }


  public onRender() {
    // TODO
  }

  public onUpdate() {
    // TODO
  }
}
