

interface DimensionValue {
  readonly [key: string]: number | string;
}

interface ThreeDimensionValue extends DimensionValue {
  x: number;
  y: number;
  z: number;
}

interface DimensionColorValue extends DimensionValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface DimensionColorHSLValue extends DimensionValue {
  h: number;
  s: number;
  l: number;
  a: number;
}

interface DimensionColorHexValue extends DimensionValue {
  hex: string;
  a: number;
}

interface FourDimensionValue extends DimensionValue {
  x: number;
  y: number;
  z: number;
  w: number;
}

export {
  ThreeDimensionValue,
  FourDimensionValue,
  DimensionColorHexValue,
  DimensionColorHSLValue,
  DimensionColorValue,
};

export type PositionValue = Partial<ThreeDimensionValue>;
export type RotationValue = ThreeDimensionValue;
export type SizeValue = Partial<ThreeDimensionValue>;
export type ColorValue = DimensionColorValue;
export type ColorHSLValue = DimensionColorHSLValue;
export type ColorHexValue = DimensionColorHexValue;
export type QuaternionValue = FourDimensionValue;

export interface PositionValues { [key: number]: PositionValue; }
export interface RotationValues { [key: number]: RotationValue; }
export interface SizeValues { [key: number]: SizeValue; }
export interface ColorValues { [key: number]: ColorValue; }
export interface ColorHSLValues { [key: number]: ColorHSLValue; }
export interface ColorHexValues { [key: number]: ColorHexValue; }
export interface QuaternionValues { [key: number]: QuaternionValue; }
