import { ShapeVertexProperties, ShapeDefinition } from '../base';
import RectangleGroup from './rectangleGroup';
import RectangleObject from './rectangleObject';

interface RectangleProperties extends ShapeVertexProperties {
  position: number;
  translate: number;
  color: number;
  pivot: number;
  rotate: number;
}

const rectangleDefinition: ShapeDefinition<RectangleProperties> = {
  shapePropoperties: {
    position: 3,
    translate: 3,
    color: 4,
    pivot: 3,
    rotate: 1 // TODO 3차원 적용으로 수정
  },
  unitVertCount: 4
};

export {
  RectangleProperties,
  rectangleDefinition as RectangleDefinition
};

export {
  RectangleGroup,
  RectangleObject
};

