import * as THREE from 'three';
import RectangleObject from './rectangleObject';
import { RenderGroup } from '../base';
import { RectangleProperties, RectangleDefinition } from './index';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';
// TODO BufferGroup에 대한 재정의가 필요하다.



export default class RectangleGroup
  extends RenderGroup<RectangleProperties, RectangleObject> {
  // private material: THREE.Material;
  protected geometry!: THREE.BufferGeometry;

  public constructor(scene: THREE.Scene, count: number) {
    super(scene, RectangleDefinition,
      THREE.BufferGeometry,
      THREE.Mesh);

    const material = new THREE.RawShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    this.initializeAttributes(count, RectangleDefinition.unitVertCount)
      .setIndex([0, 1, 3, 1, 2, 3])
      .addShaderProperties({
        vertexShader: vs,
        fragmentShader: fs,
      })
      .applyMaterial(material)
      .createObjects(RectangleObject);








    // console.log(this.geometry);
    // this.props.position.set([0, 0, 0], 0);
    // this.props.position.set([100, 0, 0], 3);
    // this.props.position.set([100, 100, 0], 6);
    // this.props.position.set([0, 100, 0], 9);

    // this.props.color.fill(1);
  }


  public onRender() {
    // TODO
  }

  public onUpdate() {
    // TODO
  }
}
