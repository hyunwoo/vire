import { ShapeVertexProperties, RenderGroup, RenderProperties } from './index';
import helper from '@/vire/helper';

export default abstract class RenderObject<P extends ShapeVertexProperties> {
  public readonly index: number;
  public readonly parent: RenderGroup<P, this>;
  public readonly props: RenderProperties<P>;
  public readonly reservedProps: RenderProperties<P>;
  protected readonly propertyKeys: Array<keyof P>;
  protected readonly propertyOffsets: { [name in keyof P]: number };
  protected readonly unitVertCount: number;
  protected injectedData: any;
  protected lerpAnimateValue: number = 0.1;
  protected lerpCompleteDistance: number = 0.01;

  public constructor(
    parent: RenderGroup<P, any>,
    unit: P,
    props: RenderProperties<P>,
    index: number,
    unitVertCount: number
  ) {
    this.parent = parent;
    this.props = props;
    this.index = index;
    this.unitVertCount = unitVertCount;

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

  public injtectData(data: any) {
    this.injectedData = data;
  }
  public getInjectedData<T>() {
    if (this.injectedData === undefined) {
      throw new Error('데이터가 설정되지 않았습니다.');
    } else {
      return this.injectedData as T;
    }
  }

  public setAnimationSpeed(value: number) {
    this.lerpAnimateValue = value;
  }
  public setAnimation(use: boolean, value: number) {
    value = value === undefined ? (use ? 0.1 : 1) : value;
    this.setAnimationSpeed(value);
  }

  public update() {
    this.beforeUpdate();
    let complete = true;
    for (const prop of this.propertyKeys) {
      const dist = helper.math.lerpFloat32Array(
        this.props[prop],
        this.reservedProps[prop],
        this.propertyOffsets[prop],
        this.lerpAnimateValue,
      );
      if (dist > this.lerpCompleteDistance) {
        complete = false;
      }
    }
    if (complete) {
      this.parent.completedUpdateObject(this);
    }

    this.checkCollision();
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
