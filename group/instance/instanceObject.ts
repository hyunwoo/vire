import { InstanceProperties } from './instanceGroup';
import * as THREE from 'three';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';


export default class InstanceObject
  extends RenderObject<InstanceProperties> {
  public constructor(
    parent: RenderGroup<InstanceProperties, any>,
    unit: InstanceProperties,
    props: RenderProperties<InstanceProperties>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }

  public color(r: number, g: number, b: number, a?: number) {
    a = (a !== undefined) ? a : 1;
    this.setPropertyValues('color', [
      r, g, b, a
    ]);
    return this;
  }
  public colorHSL(h: number, s: number, l: number, a?: number) {
    const c = new THREE.Color().setHSL(h, s, l);
    return this.color(c.r, c.g, c.b, a);
  }
  public colorHEX(hex: string, a?: number) {
    const c = new THREE.Color(hex);
    return this.color(c.r, c.g, c.b, a);
  }

  public position(
    x: number,
    y: number,
    z?: number) {
    z = z !== undefined ? z : 0;
    this.setPropertyValues('position', [x, y, z]);
    return this;
  }

  public rotate2D(degree: number) {
    const quat = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(0, 0, degree / 180 * Math.PI));
    this.setPropertyValues('rotation', quat.toArray());
    return this;
  }
  public rotate(x: number, y: number, z: number) {
    const quat = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(x / 180 * Math.PI, y / 180 * Math.PI, z / 180 * Math.PI));
    this.setPropertyValues('rotation', quat.toArray());
    return this;
  }
  public size(x: number, y: number, z?: number) {
    z = z !== undefined ? z : 0;
    this.setPropertyValues('size', [x, y, z]);
    return this;
  }


  public move(x: number, y: number, z?: number) {
    z = z !== undefined ? z : 0;
    this.deltaPropertyValues('position', [x, y, z]);
    return this;
  }
}
