import { ShapeVertexProperties, ShapeDefinition } from '../base';

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
