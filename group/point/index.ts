import { ShapeVertexProperties, ShapeDefinition } from '../base';
import PointGroup from './pointGroup';
import PointObject from './pointObject';

interface PointProperties extends ShapeVertexProperties {
  position: number;
  color: number;
}

const pointDefinition: ShapeDefinition<PointProperties> = {
  shapePropoperties: {
    position: 3,
    color: 4,
  },
  unitVertCount: 1,
};

export {
  PointProperties as PointProperties,
  pointDefinition as PointDefinition
};

export {
  PointGroup, PointObject,
};
