import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';

import { RenderGroup, ShapeProperties } from '../base';
import InstanceObject from './instanceObject';
import { InstancedBufferGeometry } from 'three';

// TODO BufferGroup에 대한 재정의가 필요하다.

export interface InstanceProperties extends ShapeProperties {
  position: number;
  color: number;
  rotation: number;
  size: number;
}

export default abstract class InstanceGroup
  extends RenderGroup<InstanceProperties, InstanceObject> {
  // private material: THREE.Material;

  public constructor(scene: THREE.Scene, count: number, radius: number, segements: number) {
    super(scene,
      {
        position: 3,
        color: 4,
        rotation: 4,
        size: 3,
      },
      THREE.InstancedBufferGeometry,
      THREE.Mesh);

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

    const geom: THREE.InstancedBufferGeometry = this.geometry as THREE.InstancedBufferGeometry;
    geom.maxInstancedCount = count;
    this.initInstanceGeometry(geom, radius, segements);
    this.initializeAttributes(count, 1, THREE.InstancedBufferAttribute);
    this.applyMaterial(material);
    this.createObjects(InstanceObject);
    this.props.color.fill(1);
    this.props.size.fill(1);

  }

  public abstract initInstanceGeometry(
    geometry: THREE.InstancedBufferGeometry,
    radius: number,
    segements: number): void;


  public onRender() {
    // TODO
  }

  public onUpdate() {
    // TODO
  }
}
