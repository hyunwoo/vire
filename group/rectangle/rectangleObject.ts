import LineSegementGroup, { Rectangle2DProperties } from './rectangleGroup';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { enumerable } from '@/vl/lib/decorator/enumerable';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';



export default class Rectangle2DObject
  extends RenderObject<Rectangle2DProperties> {

  private _width: number = 0;
  private _height: number = 0;
  public constructor(
    parent: RenderGroup<Rectangle2DProperties, any>,
    unit: Rectangle2DProperties,
    props: RenderProperties<Rectangle2DProperties>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }
  public setColor(r: number, g: number, b: number, a?: number) {
    a = (a !== undefined) ? a : 1;
    this.setPropertyValues('color', [
      r, g, b, a,
      r, g, b, a,
      r, g, b, a,
      r, g, b, a,
    ]);
    return this;
  }
  public setColorHSL(h: number, s: number, l: number, a?: number) {
    const c = new THREE.Color().setHSL(h, s, l);
    return this.setColor(c.r, c.g, c.b, a);
  }
  public setColorHEX(hex: string, a?: number) {
    const c = new THREE.Color(hex);
    return this.setColor(c.r, c.g, c.b, a);
  }

  public set x(x: number) {
    this.setProperty('translate', x, 0);
    this.setProperty('translate', x, 3);
    this.setProperty('translate', x, 6);
    this.setProperty('translate', x, 9);
  }
  public set y(y: number) {
    this.setProperty('translate', y, 1);
    this.setProperty('translate', y, 4);
    this.setProperty('translate', y, 7);
    this.setProperty('translate', y, 10);
  }
  public set width(w: number) {
    this._width = w;
    this.parent.allocateUpdateObject(this);
  }

  public set height(h: number) {
    this._height = h;
    this.parent.allocateUpdateObject(this);
  }


  public move(x: number, y: number, z?: number): this {
    this.deltaPropertyValues('translate', [x, y, 0, x, y, 0, x, y, 0, x, y, 0]);

    return this;
  }

  protected beforeUpdate() {
    this.updateSize();
  }

  private updateSize() {
    const dw = this._width / 2;
    const dh = this._height / 2;

    this.setPropertyValues('position', [
      -dw, -dh, 0,
      dw, -dh, 0,
      dw, dh, 0,
      -dw, dh, 0
    ]);
  }
}
