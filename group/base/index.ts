
import RenderGroup from './renderGroup';
import RenderObject from './renderObject';


export interface GroupAnimation {
  use: boolean;
  animationLerpValue: number;
}

export type RenderGroupAttributes<P extends ShapeVertexProperties> = {
  readonly [name in keyof P]: THREE.BufferAttribute
};

export type RenderProperties<P extends ShapeVertexProperties> = {
  readonly [name in keyof P]: Float32Array
};


export interface ShapeDefinition<P extends ShapeVertexProperties> {
  readonly shapePropoperties: P;
  readonly unitVertCount: number;
}


export interface ShapeVertexProperties {
  readonly [name: string]: number;
}

export { RenderGroup, RenderObject };
