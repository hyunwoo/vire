import { InstanceProperties } from './index';
import * as THREE from 'three';
import RenderObject from '../base/renderObject';
import { RenderGroup, RenderProperties } from '../base';
import { PositionValue } from '../../dimensionValues';
import RenderObjectSingleVertex from '../base/renderObjectSingleVertex';


export default class InstanceObject
  extends RenderObjectSingleVertex<InstanceProperties> {
  public constructor(
    parent: RenderGroup<InstanceProperties, any>,
    unit: InstanceProperties,
    props: RenderProperties<InstanceProperties>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }

}
