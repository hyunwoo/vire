import LineGroup, { LineAttributes, LineProperties } from './lineGroup';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { enumerable } from '@/vl/lib/decorator/enumerable';



export default class LineObject<T> {
  public needsUpdate: boolean = false;

  public readonly index: number;
  public readonly parent: LineGroup<T>;

  private readonly props: LineProperties;
  private readonly reservedProps: LineProperties;

  public constructor(parent: LineGroup<T>, index: number, props: LineProperties) {
    this.parent = parent;
    this.props = props;
    this.index = index;
    this.reservedProps = {
      position: new Float32Array(12),
      halfPosition: new Float32Array(12),
      pivot: new Float32Array(12),
      color: new Float32Array(16),
      width: new Int16Array(4).fill(2)
    };
  }

  public injectOption(option: T) {
    // Assign? or option
  }


  public update() {
    this.props.position.set(this.reservedProps.position, this.index * 4 * 3);
    this.props.halfPosition.set(this.reservedProps.halfPosition, this.index * 4 * 3);
    this.props.color.set(this.reservedProps.color, this.index * 4 * 4);
    this.props.pivot.set(this.reservedProps.pivot, this.index * 4 * 3);
    this.props.width.set(this.reservedProps.width, this.index * 4);
    // TODO Lerp & Animated
    this.parent.completedUpdateObject(this);
  }

  public setColor(r: number, g: number, b: number, a?: number) {
    a = (a !== undefined) ? a : 1;
    this.reservedProps.color.set([
      r, g, b, a,
      r, g, b, a,
      r, g, b, a,
      r, g, b, a
    ]);
    this.needsUpdate = true;
    this.parent.allocateUpdateObject(this);
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


  public setPosition(x1: number, y1: number, x2: number, y2: number): this;
  public setPosition(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): this;
  public setPosition(
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

    this.reservedProps.halfPosition.set([
      x1, y1, z1,
      x1, y1, z1,
      x2, y2, z2,
      x2, y2, z2,
    ]);
    this.updateGeometry();
    return this;
  }

  public setWidth(w1: number, w2?: number) {
    w2 = w2 ? w2 : w1;
    this.reservedProps.width.set([w1, w1, w2, w2]);
    this.updateGeometry();
    return this;
  }

  public move(x: number, y: number, z: number): this;
  public move(x1: number, y1: number, x2: number, y2: number): this;
  public move(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): this;
  public move(x1: number, y1: number, z1?: number, x2?: number, y2?: number, z2?: number) {
    let val: [number, number, number,
      number, number, number,
      number, number, number,
      number, number, number] =
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (z1 === undefined) {
      val = [
        x1, y1, 0,
        x1, y1, 0,
        x1, y1, 0,
        x1, y1, 0];
    } else if (x2 === undefined) {
      val = [
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1,
        x1, y1, z1];
    } else if (y2 === undefined || z2 === undefined) {
      val = [
        x1, y1, 0,
        x1, y1, 0,
        z1, x2, 0,
        z1, x2, 0];
    } else {
      val = [
        x1, y1, z1,
        x1, y1, z1,
        x2, y2, z2,
        x2, y2, z2];
    }
    this.reservedProps.halfPosition.set(val);
    this.updateGeometry();
    return this;
  }

  private updateGeometry() {
    const h1: Vector3 = new Vector3();
    h1.set(
      this.reservedProps.halfPosition[0],
      this.reservedProps.halfPosition[1],
      this.reservedProps.halfPosition[2]
    );
    const h2: Vector3 = new Vector3();
    h2.set(
      this.reservedProps.halfPosition[6],
      this.reservedProps.halfPosition[7],
      this.reservedProps.halfPosition[8]
    );

    const w1 = this.reservedProps.width[0] * .5;
    const w2 = this.reservedProps.width[2] * .5;

    const cross = new Vector3(h2.x - h1.x, h2.y - h1.y, h2.z - h1.z)
      .cross(new Vector3(0, 0, 1)).normalize();

    this.reservedProps.position.set([
      h1.x + cross.x * w1, h1.y + cross.y * w1, h1.z + cross.z * w1,
      h2.x + cross.x * w2, h2.y + cross.y * w2, h2.z + cross.z * w2,
      h2.x - cross.x * w2, h2.y - cross.y * w2, h2.z - cross.z * w2,
      h1.x - cross.x * w1, h1.y - cross.y * w1, h1.z - cross.z * w1,
    ]);

    this.needsUpdate = true;
    this.parent.allocateUpdateObject(this);
  }
}
