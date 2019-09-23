import { ShapeVertexProperties, ShapeDefinition } from '../base';
import LineSegementGroup from './lineSegementGroup';
import LineSegementObject from './lineSegementObject';
interface LineSegementProperties extends ShapeVertexProperties {
  position: number;
  color: number;
}

const lineDefinition: ShapeDefinition<LineSegementProperties> = {
  shapePropoperties: {
    position: 3,
    color: 4,
  },
  unitVertCount: 2,
};

export {
  LineSegementProperties,
  lineDefinition as LineDefinition
};

export {
  LineSegementGroup,
  LineSegementObject
};
