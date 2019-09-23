import LineSegementGroup from './pointGroup';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { enumerable } from '@/vire/lib/decorator/enumerable';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';
import { PointProperties } from './index';
import {
  PositionValues,
  PositionValue
} from '@/vire/dimensionValues';
import helper from '@/vire/helper';
import RenderObjectSingleVertex from '../base/renderObjectSingleVertex';




export default class PointObject
  extends RenderObjectSingleVertex<PointProperties> {
  public constructor(
    parent: RenderGroup<PointProperties, any>,
    unit: PointProperties,
    props: RenderProperties<PointProperties>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }

  public move(values: PositionValues) {
    this.deltaPropertyValues('position',
      helper.Util.toDimensionValuesAsArrayByDefault<PositionValue, PositionValues>(
        values,
        0,
        this.unitVertCount * 3,
        ['x', 'y', 'z']
      ));
  }
  public set scale(size: number) {
    if (this.reservedProps.size === undefined) {
      throw new Error('오브젝트에 size 속성이 없습니다.');
    }
    this.setSize({ x: size });
  }
  public get scale() {
    if (this.reservedProps.size === undefined) {
      throw new Error('오브젝트에 size 속성이 없습니다.');
    }
    return this.props.size[this.propertyOffsets.size];
  }



}
