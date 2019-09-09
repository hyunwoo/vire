import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup, ShapeProperties } from '../base';
import Rectangle2DObject from './rectangleObject';

// TODO BufferGroup에 대한 재정의가 필요하다.

export interface Rectangle2DProperties extends ShapeProperties {
  position: number;
  translate: number;
  color: number;
  pivot: number;
  rotate: number;
}

export default class RectangleGroup
  extends RenderGroup<Rectangle2DProperties, Rectangle2DObject> {
  // private material: THREE.Material;
  protected geometry!: THREE.BufferGeometry;

  public constructor(scene: THREE.Scene, count: number) {
    super(scene,
      {
        position: 3,
        translate: 3,
        color: 4,
        pivot: 3,
        rotate: 1
      },
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

    this.initializeAttributes(count, 4)
      .setIndex([0, 1, 3, 1, 2, 3])
      .addShaderProperties({
        vertexShader: vs,
        fragmentShader: fs,
      })
      .applyMaterial(material)
      .createObjects(Rectangle2DObject);








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
