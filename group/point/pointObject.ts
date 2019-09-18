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
import RenderObjectMultiVertex from '../base/renderObjectMultiVertex';



export default class PointObject
  extends RenderObjectMultiVertex<PointProperties> {
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


}
