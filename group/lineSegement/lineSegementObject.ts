import LineSegementGroup, { LineSegementProperties } from './lineSegementGroup';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { enumerable } from '@/vl/lib/decorator/enumerable';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';



export default class LineSegementObject
  extends RenderObject<LineSegementProperties> {
  public constructor(
    parent: RenderGroup<LineSegementProperties, any>,
    unit: LineSegementProperties,
    props: RenderProperties<LineSegementProperties>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }

  public color(r: number, g: number, b: number, a?: number) {
    a = (a !== undefined) ? a : 1;
    this.setPropertyValues('color', [
      r, g, b, a,
      r, g, b, a,
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



  public position(x1: number, y1: number, x2: number, y2: number): this;
  public position(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): this;
  public position(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2?: number,
    z2?: number) {

    if (y2 === undefined || z2 === undefined) {
      y2 = x2;
      x2 = z1;
      z2 = 0;
      z1 = 0;
    }
    this.setPropertyValues('position', [x1, y1, z1, x2, y2, z2]);
    return this;
  }


  public move(x: number, y: number, z: number): this;
  public move(x1: number, y1: number, x2: number, y2: number): this;
  public move(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): this;
  public move(x1: number, y1: number, z1?: number, x2?: number, y2?: number, z2?: number) {
    let val: [number, number, number,
      number, number, number] =
      [0, 0, 0, 0, 0, 0];
    if (z1 === undefined) {
      val = [
        x1, y1, 0,
        x1, y1, 0];
    } else if (x2 === undefined) {
      val = [
        x1, y1, z1,
        x1, y1, z1];
    } else if (y2 === undefined || z2 === undefined) {
      val = [
        x1, y1, 0,
        z1, x2, 0];
    } else {
      val = [
        x1, y1, z1,
        x2, y2, z2];
    }

    this.deltaPropertyValues('position', val);
    return this;
  }

  // close function
  private size() {
    return this;
  }

  // close function
  private rotate() {
    return this;
  }
}
