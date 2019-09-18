import * as THREE from 'three';
import {
  ColorHSLValues,
  ColorHSLValue,
  ColorValue,
  ColorValues,
  ColorHexValues,
  ColorHexValue
} from '../dimensionValues';






export default {
  Util: {
    getValidNumber(val: number | undefined, defaultValue?: any): number {
      return val !== undefined ? val : 0;
    },
    toColorHSLValuesAsColorValues(values: ColorHSLValues, defaultValues: Float32Array, length: number) {
      const ret: ColorValues = {};
      for (let i = 0; i < length; i++) {
        if (values[i] === undefined) {
          const c = new THREE.Color().setRGB(
            defaultValues[i * 4],
            defaultValues[i * 4 + 1],
            defaultValues[i * 4 + 2]);
          ret[i] = {
            r: c.r,
            g: c.g,
            b: c.b,
            a: 1
          };
        } else {
          const val = this.toColorHSLValueAsColorValue(values[i]);
          ret[i] = val;
        }
      }
      return ret;
    },
    toColorHSLValueAsColorValue(value: ColorHSLValue): ColorValue {
      if (value === undefined) {
        return {
          r: 0,
          g: 0,
          b: 0,
          a: 0,
        };
      }
      const c = new THREE.Color().setHSL(value.h, value.s, value.l);
      return {
        r: c.r,
        g: c.g,
        b: c.b,
        a: value.a !== undefined ? value.a : 1,
      };
    },
    toColorHexValuesAsColorValues(
      values: ColorHexValues,
      defaultValues: Float32Array,
      length: number) {
      const ret: ColorValues = {};
      for (let i = 0; i < length; i++) {
        ret[i] = this.toColorHexValueAsColorValue(values[i]);
      }
      return ret;
    },
    toColorHexValueAsColorValue(value: ColorHexValue): ColorValue {
      const c = new THREE.Color(value.hex);
      return {
        r: c.r,
        g: c.g,
        b: c.b,
        a: value.a !== undefined ? value.a : 1,
      };
    },
    toDimensionValuesAsArrayByDefault<Value, Values>(
      values: Values,
      defaultValue: number,
      length: number,
      keys: Array<keyof Value>): number[] {
      const ret: number[] = new Array<number>(length);
      const vertexCount = length / keys.length;
      for (let i = 0; i < vertexCount; i++) {
        if (values[i]) {
          for (let j = 0; j < keys.length; j++) {
            ret[i * keys.length + j] =
              values[i][keys[j]] !== undefined ? values[i][keys[j]] : defaultValue;
          }
        } else {
          for (let j = 0; j < keys.length; j++) {
            ret[i * keys.length + j] = defaultValue;
          }
        }
      }
      return ret;
    },
    toDimensionValuesAsArray<Value, Values>(
      values: Values,
      defaultValues: Float32Array,
      keys: Array<keyof Value>): number[] {
      const ret: number[] = new Array<number>(defaultValues.length);
      const vertexCount = defaultValues.length / keys.length;
      for (let i = 0; i < vertexCount; i++) {
        if (values[i]) {
          for (let j = 0; j < keys.length; j++) {
            ret[i * keys.length + j] =
              values[i][keys[j]] !== undefined
                ? values[i][keys[j]] : defaultValues[i * keys.length + j];
          }
        } else {
          for (let j = 0; j < keys.length; j++) {
            ret[i * keys.length + j] = defaultValues[i * keys.length + j];
          }
        }
      }
      return ret;
    }
  },
  math: {
    lerp(start: number, end: number, amt: number) {
      return (1 - amt) * start + amt * end;
    },
    lerpFloat32Array(arr: Float32Array, values: Float32Array, offset: number, t: number) {
      let dist = 0;
      for (let i = 0; i < values.length; i++) {
        arr[offset + i] = arr[offset + i] + (values[i] - arr[offset + i]) * t;
        dist += (arr[offset + i] - values[i]) * (arr[offset + i] - values[i]);
      }
      return Math.sqrt(dist);
    },
    lerpOnArray(
      arr: Float32Array,
      index: number,
      values: number[],
      length: number,
      t: number) {
      for (let i = 0; i < length; i++) {
        arr[index * length + i] =
          arr[index * length + i] +
          (values[i] - arr[index * length + i]) * t;
      }
      let dist = 0;
      for (let i = 0; i < length; i++) {
        dist += arr[index * length] - values[i];
      }
      return Math.sqrt(dist);
    }
  }
};
