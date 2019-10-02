
export interface PointGroupType {
  readonly circle: string;
  readonly rect: string;
  readonly triangle: string;
  readonly hexagonal: string;
  readonly octagonal: string;
}

const pointGroupTypeTextures: PointGroupType = {
  circle: '/texture/circle_32.png',
  rect: '/texture/rect_32.png',
  triangle: '/texture/triangle_32.png',
  hexagonal: '/texture/hexagonal_32.png',
  octagonal: '/texture/octagonal_32.png',
};

export {
  pointGroupTypeTextures as PointGroupTypeTextures
};


