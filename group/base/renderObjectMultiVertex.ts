
import * as THREE from 'three';
import {
  RenderGroup,
  RenderProperties,
  ShapeVertexProperties,
} from '../base';
import {
  PositionValues,
  RotationValues,
  SizeValues,
  ColorValues,
  ColorHSLValues,
  ColorHexValues,
  PositionValue,
  ColorValue,
  ThreeDimensionValue,
} from '../../dimensionValues';
import helper from '@/vire/helper';
import RenderObject from './renderObject';


export default abstract class RenderObjectMultiVertex<P extends ShapeVertexProperties>
  extends RenderObject<P> {
  public constructor(
    parent: RenderGroup<P,
      any>,
    unit: P,
    props: RenderProperties<P>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }
  public get position(): PositionValues {
    if (this.reservedProps.position === undefined) {
      throw new Error('오브젝트에 position 속성이 없습니다.');
    }
    // TODO Create function
    const ret: PositionValues = {};
    for (let i = 0; i < this.unitVertCount; i++) {
      ret[i] = {
        x: this.props.position[this.propertyOffsets.position + i * 3],
        y: this.props.position[this.propertyOffsets.position + i * 3 + 1],
        z: this.props.position[this.propertyOffsets.position + i * 3 + 2],
      };
    }
    return ret;
  }
  public set position(arg: PositionValues) {
    this.setPropertyValues('position',
      helper.Util.toDimensionValuesAsArray<PositionValue, PositionValues>(
        arg, this.reservedProps.position, ['x', 'y', 'z']
      )
    );
  }
  public setPosition(arg: PositionValues) {
    this.position = arg;
    return this;
  }
  public getPositions() {
    return this.position as { [key: number]: ThreeDimensionValue; };
  }


  public get color(): ColorValues {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    // TODO Create function
    const ret: ColorValues = {};
    for (let i = 0; i < this.unitVertCount; i++) {
      ret[i] = {
        r: this.props.color[this.propertyOffsets.color + i * 3],
        g: this.props.color[this.propertyOffsets.color + i * 3 + 1],
        b: this.props.color[this.propertyOffsets.color + i * 3 + 2],
        a: this.props.color[this.propertyOffsets.color + i * 3 + 3],
      };
    }
    return ret;
  }
  public set color(arg: ColorValues) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    this.setPropertyValues('color',
      helper.Util.toDimensionValuesAsArray<ColorValue, ColorValues>
        (arg, this.reservedProps.color, ['r', 'g', 'b', 'a']));
  }
  public setColor(arg: ColorValues): this {
    this.color = arg;
    return this;
  }

  public set colorHSL(arg: ColorHSLValues) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    const c = helper.Util.toColorHSLValuesAsColorValues(arg,
      this.reservedProps.color,
      this.unitVertCount);
    this.color = c;
  }
  public setColorHSL(arg: ColorHSLValues): this {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    const c = helper.Util.toColorHSLValuesAsColorValues(arg,
      this.reservedProps.color,
      this.unitVertCount);
    this.color = c;
    return this;
  }

  public set colorHex(arg: ColorHexValues) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    const c = helper.Util.toColorHexValuesAsColorValues(arg,
      this.reservedProps.color,
      this.unitVertCount);
    this.color = c;
  }
  public setColorHex(arg: ColorHexValues): this {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    const c = helper.Util.toColorHexValuesAsColorValues(arg,
      this.reservedProps.color,
      this.unitVertCount);
    this.color = c;
    return this;
  }


  protected get rotate() {
    throw new Error('vertex가 여러개인 object에서는 일반적인 rotate를 정의 할 수 없습니다. 함수의 재정의가 필요합니다.');
  }
  protected set rotate(arg: RotationValues) {
    throw new Error('vertex가 여러개인 object에서는 일반적인 rotate를 정의 할 수 없습니다. 함수의 재정의가 필요합니다.');
  }
  protected setRotate(arg: RotationValues) {
    throw new Error('vertex가 여러개인 object에서는 일반적인 rotate를 정의 할 수 없습니다. 함수의 재정의가 필요합니다.');
    return this;
  }

  protected get size() {
    throw new Error('오브젝트에 rotation 속성이 없습니다.');
  }
  protected set size(arg: SizeValues) {
    throw new Error('vertex가 여러개인 object에서는 일반적인 size를 정의 할 수 없습니다. 함수의 재정의가 필요합니다.');
  }
  protected setSize(arg: SizeValues) {
    throw new Error('vertex가 여러개인 object에서는 일반적인 size를 정의 할 수 없습니다. 함수의 재정의가 필요합니다.');
    return this;
  }


}
