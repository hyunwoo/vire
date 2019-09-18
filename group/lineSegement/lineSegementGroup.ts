import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup, ShapeVertexProperties } from '../base';
import LineSegementObject from './lineSegementObject';
import { LineSegementProperties, LineDefinition } from './index';

// TODO BufferGroup에 대한 재정의가 필요하다.



export default class LineSegementGroup
  extends RenderGroup<LineSegementProperties, LineSegementObject> {
  // private material: THREE.Material;
  protected geometry!: THREE.BufferGeometry;

  public constructor(scene: THREE.Scene, count: number) {
    super(scene, LineDefinition,
      THREE.BufferGeometry,
      THREE.LineSegments);

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

    this.initializeAttributes(count, LineDefinition.unitVertCount);
    this.applyMaterial(material);
    this.createObjects(LineSegementObject);
    console.log(this.props);
    this.props.color.fill(1);
  }


  public onRender() {
    // TODO
  }

  public onUpdate() {
    // TODO
  }
}
