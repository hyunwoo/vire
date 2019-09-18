import * as THREE from 'three';
import { RenderGroup } from '../base';
import InstanceObject from './instanceObject';
import { InstanceProperties, InstanceDefinition } from './index';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';


export default abstract class InstanceGroup
  extends RenderGroup<InstanceProperties, InstanceObject> {
  // private material: THREE.Material;

  public constructor(scene: THREE.Scene, count: number, ...args) {
    super(scene, InstanceDefinition,
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
    this.initInstanceGeometry(geom, args);
    this.initializeAttributes(count, InstanceDefinition.unitVertCount, THREE.InstancedBufferAttribute);
    this.applyMaterial(material);
    this.createObjects(InstanceObject);
    this.props.color.fill(1);
    this.props.size.fill(1);

  }

  public abstract initInstanceGeometry(
    geometry: THREE.InstancedBufferGeometry, ...args): void;


  public onRender() {
    // TODO
  }

  public onUpdate() {
    // TODO
  }
}
