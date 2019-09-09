
import RenderGroup from './renderGroup';


export interface GroupAnimation {
  use: boolean;
  animationLerpValue: number;
}

export type RenderGroupAttributes<P extends ShapeProperties> = {
  readonly [name in keyof P]: THREE.BufferAttribute
};

export type RenderProperties<P extends ShapeProperties> = {
  readonly [name in keyof P]: Float32Array
};


export interface ShapeProperties {
  readonly [name: string]: number;
}
export interface Shape {
  readonly vertCount: number;
  readonly prop: ShapeProperties;
}

export { RenderGroup };
