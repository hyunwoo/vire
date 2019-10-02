import { ShapeVertexProperties, ShapeDefinition } from '../base';
import SmokeText from './smokeText';
import SmokeGroup from './smokeGroup';
import SmokeObject from './smokeObject';

interface SmokeProperties extends ShapeVertexProperties {
  position: number;
  color: number;
}

const smokeDefinition: ShapeDefinition<SmokeProperties> = {
  shapePropoperties: {
    position: 3,
    color: 4,
    size: 3,
  },
  unitVertCount: 1,
};

export {
  SmokeProperties,
  smokeDefinition as SmokeDefinition
};

export {
  SmokeGroup, SmokeObject,
};

export {
  SmokeText
}
