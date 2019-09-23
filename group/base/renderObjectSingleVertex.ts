
import * as THREE from 'three';
import RenderObject from './renderObject';
import {
  RenderGroup,
  RenderProperties,
  ShapeVertexProperties,
} from '../base';
import {
  PositionValue,
  RotationValue,
  SizeValue,
  ColorValue,
  ColorHSLValue,
  ColorHexValue,
  ThreeDimensionValue,
  DimensionColorValue,
} from '../../dimensionValues';
import helper from '@/vire/helper';



export default abstract class RenderObjectSingleVertex<P extends ShapeVertexProperties>
  extends RenderObject<P> {
  public constructor(
    parent: RenderGroup<P,
      any>,
    unit: P,
    props: RenderProperties<P>,
    index: number,
    unitVertCount: number) {
    super(parent, unit, props, index, unitVertCount);
  }
  public get position(): PositionValue {
    if (this.reservedProps.position === undefined) {
      throw new Error('오브젝트에 position 속성이 없습니다.');
    }
    return {
      x: this.props.position[this.propertyOffsets.position],
      y: this.props.position[this.propertyOffsets.position + 1],
      z: this.props.position[this.propertyOffsets.position + 2],
    };
  }

  public set position(arg: PositionValue) {
    if (this.reservedProps.position === undefined) {
      throw new Error('오브젝트에 position 속성이 없습니다.');
    }
    this.setPropertyValues('position', [
      arg.x !== undefined ? arg.x : this.reservedProps.position[0],
      arg.y !== undefined ? arg.y : this.reservedProps.position[1],
      arg.z !== undefined ? arg.z : this.reservedProps.position[2],
    ]);
  }

  public setPotision(arg: PositionValue): this {
    this.position = arg;
    return this;
  }

  public getPosition(): ThreeDimensionValue {
    if (this.reservedProps.position === undefined) {
      throw new Error('오브젝트에 position 속성이 없습니다.');
    }
    return {
      x: this.props.position[this.propertyOffsets.position],
      y: this.props.position[this.propertyOffsets.position + 1],
      z: this.props.position[this.propertyOffsets.position + 2],
    };
  }


  public get rotate(): RotationValue {
    if (this.reservedProps.rotation === undefined) {
      throw new Error('오브젝트에 rotation 속성이 없습니다.');
    }
    return {
      x: this.props.position[this.propertyOffsets.rotation],
      y: this.props.position[this.propertyOffsets.rotation + 1],
      z: this.props.position[this.propertyOffsets.rotation + 2],
    };
  }
  public set rotate(arg: RotationValue) {
    if (this.reservedProps.rotation === undefined) {
      throw new Error('오브젝트에 rotation 속성이 없습니다.');
    }
    const originEuler = new THREE.Euler().setFromQuaternion(
      new THREE.Quaternion(
        this.reservedProps.rotation[0],
        this.reservedProps.rotation[1],
        this.reservedProps.rotation[2],
        this.reservedProps.rotation[3],
      )
    );
    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        arg.x !== undefined ? arg.x : originEuler.x,
        arg.y !== undefined ? arg.y : originEuler.y,
        arg.z !== undefined ? arg.z : originEuler.z
      )
    );
    this.setPropertyValues('rotation', quat.toArray());
  }
  public setRotate(arg: RotationValue) {
    this.rotate = arg;
    return this;
  }

  public get size(): SizeValue {
    if (this.reservedProps.size === undefined) {
      throw new Error('오브젝트에 size 속성이 없습니다.');
    }
    return {
      x: this.props.size[this.propertyOffsets.size],
      y: this.props.size[this.propertyOffsets.size + 1],
      z: this.props.size[this.propertyOffsets.size + 2],
    };
  }
  public set size(arg: SizeValue) {
    if (this.reservedProps.size === undefined) {
      throw new Error('오브젝트에 size 속성이 없습니다.');
    }
    this.setPropertyValues('size', [
      arg.x !== undefined ? arg.x : this.reservedProps.size[0],
      arg.y !== undefined ? arg.y : this.reservedProps.size[1],
      arg.z !== undefined ? arg.z : this.reservedProps.size[2],
    ]);
  }
  public setSize(arg: SizeValue): this {
    this.size = arg;
    return this;
  }


  public get color(): ColorValue {
    if (this.reservedProps.size === undefined) {
      throw new Error('오브젝트에 size 속성이 없습니다.');
    }
    return {
      r: this.props.color[this.propertyOffsets.color],
      g: this.props.color[this.propertyOffsets.color + 1],
      b: this.props.color[this.propertyOffsets.color + 2],
      a: this.props.color[this.propertyOffsets.color + 3],
    };
  }
  public set color(arg: ColorValue) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    this.setPropertyValues('color', [
      arg.r !== undefined ? arg.r : this.reservedProps.color[0],
      arg.g !== undefined ? arg.g : this.reservedProps.color[1],
      arg.b !== undefined ? arg.b : this.reservedProps.color[2],
      arg.a !== undefined ? arg.a : this.reservedProps.color[3],
    ]);
  }
  public setColor(arg: ColorValue): this {
    this.color = arg;
    return this;
  }

  public set colorHSL(arg: ColorHSLValue) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }
    const c = helper.Util.toColorHSLValueAsColorValue(arg);
    this.setPropertyValues('color', [c.r, c.g, c.b, c.a]);
  }
  public setColorHSL(arg: ColorHSLValue): this {
    const c = helper.Util.toColorHSLValueAsColorValue(arg);
    this.color = c;
    return this;
  }



  public set colorHex(arg: ColorHexValue | string) {
    if (this.reservedProps.color === undefined) {
      throw new Error('오브젝트에 color 속성이 없습니다.');
    }

    if (typeof arg === 'string') {
      const color = new THREE.Color(arg);
      const c: DimensionColorValue = {
        r: color.r,
        g: color.g,
        b: color.b,
        a: 1,
      };
      this.setPropertyValues('color', [c.r, c.g, c.b, c.a]);
    } else {
      const c = helper.Util.toColorHexValueAsColorValue(arg);
      this.setPropertyValues('color', [c.r, c.g, c.b, c.a]);
    }

  }
  public setColorHex(arg: ColorHexValue): void;
  public setColorHex(arg: string, opacity?: number): void;
  public setColorHex(arg: ColorHexValue | string, opacity?: number): this {

    if (typeof arg === 'string') {
      const color = new THREE.Color(arg);
      const c: DimensionColorValue = {
        r: color.r,
        g: color.g,
        b: color.b,
        a: opacity === undefined ? 1 : opacity,
      };
      this.setPropertyValues('color', [c.r, c.g, c.b, c.a]);
    } else {
      const c = helper.Util.toColorHexValueAsColorValue(arg);
      this.setPropertyValues('color', [c.r, c.g, c.b, c.a]);
    }
    return this;
  }


}
