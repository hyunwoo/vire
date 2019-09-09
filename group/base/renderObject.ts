import { ShapeProperties, RenderGroup, RenderProperties } from './index';
import helper from '@/vl/helper';



export default abstract class RenderObject<P extends ShapeProperties> {
  public readonly index: number;
  public readonly parent: RenderGroup<P, this>;
  public readonly props: RenderProperties<P>;
  public readonly reservedProps: RenderProperties<P>;
  protected readonly propertyKeys: Array<keyof P>;
  protected readonly propertyOffsets: {
    [name in keyof P]: number;
  };


  public constructor(
    parent: RenderGroup<P, any>,
    unit: P,
    props: RenderProperties<P>,
    index: number,
    unitVertCount: number) {

    this.parent = parent;
    this.props = props;
    this.index = index;

    // 초기화 부터 다시 시...바....
    this.propertyKeys = Object.keys(unit) as Array<keyof P>;
    // @ts-ignore 초기화
    this.reservedProps = {};
    // @ts-ignore 초기화
    this.propertyOffsets = {};
    for (const key of this.propertyKeys) {
      // @ts-ignore readonly 이지만 초기화 하기위한 방법이 마땅하지 않음.
      this.reservedProps[key] = new Float32Array(unit[key] * unitVertCount);
      this.propertyOffsets[key] = unit[key] * index * unitVertCount;
    }
  }

  public set needsUpdate(b: boolean) {
    if (b) {
      this.parent.allocateUpdateObject(this);
    } else {
      this.parent.completedUpdateObject(this);
    }
  }

  public update() {
    this.beforeUpdate();
    let complete = true;
    for (const prop of this.propertyKeys) {
      const dist = helper.math.lerpFloat32Array(
        this.props[prop],
        this.reservedProps[prop],
        this.propertyOffsets[prop], 0.1);
      if (dist > 0.01) {
        complete = false;
      }
    }
    if (complete) {
      this.parent.completedUpdateObject(this);
    }

    this.checkCollision();
  }

  public move(...any: number[]): this {
    return this;
  }
  public position(...any: number[]): this {
    return this;
  }
  public rotate(...any: number[]): this {
    return this;
  }
  public size(...any: number[]): this {
    return this;
  }
  public color(...any: number[]): this {
    return this;
  }
  public colorHSL(...any: number[]): this {
    return this;
  }
  public colorHEX(...any: any): this {
    return this;
  }


  protected setProperty(name: keyof P, value: number, offset: number) {
    this.reservedProps[name][offset] = value;
    this.parent.allocateUpdateObject(this);
  }

  protected setPropertyValues(name: keyof P, values: ArrayLike<number>) {
    this.reservedProps[name].set(values);
    this.parent.allocateUpdateObject(this);
  }

  protected deltaPropertyValues(name: keyof P, values: ArrayLike<number>) {
    for (let i = 0; i < values.length; i++) {
      this.reservedProps[name][i] = this.reservedProps[name][i] + values[i];
    }
    this.parent.allocateUpdateObject(this);
  }
  protected deltaProperty(name: keyof P, value: number, offset: number) {
    this.reservedProps[name][offset] = this.reservedProps[name][offset] + value;
    this.parent.allocateUpdateObject(this);
  }

  protected beforeUpdate() {
    // before function
  }

  protected checkCollision() {
    // TODO Collision Checker
  }
}
