import LineSegementGroup from './lineSegementGroup';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { enumerable } from '@/vire/lib/decorator/enumerable';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';
import { LineSegementProperties } from './index';
import {
  PositionValues,
  PositionValue
} from '@/vire/dimensionValues';
import helper from '@/vire/helper';
import RenderObjectMultiVertex from '../base/renderObjectMultiVertex';



export default class LineSegementObject
  extends RenderObjectMultiVertex<LineSegementProperties> {
  public constructor(
    parent: RenderGroup<LineSegementProperties, any>,
    unit: LineSegementProperties,
    props: RenderProperties<LineSegementProperties>,
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
