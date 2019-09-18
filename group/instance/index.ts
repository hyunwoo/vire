
import { ShapeVertexProperties, ShapeDefinition } from '../base';
import InstanceGroup from './instanceGroup';
import InstanceObject from './instanceObject';
import InstanceCircleGroup from './instanceCircleGroup';

interface InstanceProperties extends ShapeVertexProperties {
  readonly position: number;
  readonly color: number;
  readonly rotation: number;
  readonly size: number;
}

const instanceDefinition: ShapeDefinition<InstanceProperties> = {
  shapePropoperties: {
    position: 3,
    color: 4,
    rotation: 4,
    size: 3,
  },
  unitVertCount: 1,
};

export {
  InstanceProperties,
  instanceDefinition as InstanceDefinition
};

export {
  InstanceGroup,
  InstanceCircleGroup as InstancePlaneGroup,
  InstanceObject
};

