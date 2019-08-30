import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';
import RenderGroup from '../base/renderGroup';
import _ from 'lodash';
import Helper from '../../helper';


import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry';
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js';

import { ReserveAttribute } from '../base';
import { BufferAttribute, BufferGeometry } from 'three';
import LineObject from './lineObject';

// TODO BufferGroup에 대한 재정의가 필요하다.


interface BaseAttributes {
  [key: string]: BufferAttribute;
}

export interface LineAttributes {
  readonly position: BufferAttribute;
  readonly halfPosition: BufferAttribute;
  readonly pivot: BufferAttribute;
  readonly color: BufferAttribute;
  readonly width: BufferAttribute;
}

interface BaseProperties {
  [key: string]: Float32Array | Int16Array;
}

export interface LineProperties {
  readonly position: Float32Array;
  readonly halfPosition: Float32Array;
  readonly pivot: Float32Array;
  readonly color: Float32Array;
  readonly width: Int16Array;
}

export default class LineGroup<T> extends RenderGroup<THREE.Mesh> {
  // private material: THREE.Material;
  private geometry!: BufferGeometry;
  private indices: number[] = [];
  private attr!: LineAttributes;
  private props!: LineProperties;
  private updateReservedObjects: { [key: number]: LineObject<T> } = {};
  private removeReservedIndices: number[] = [];

  private _objects: Array<LineObject<T>> = [];

  public get objects() {
    return this._objects;
  }

  public constructor(scene: THREE.Scene, verts: number[], count: number) {
    super(scene, count * verts.length / 3);
    // Index Setting
    this.geometry = new THREE.BufferGeometry();
    this.indices = [];
    for (let i = 0; i < count; i++) {
      const idx = i * 4;
      this.indices.push(idx + 0);
      this.indices.push(idx + 1);
      this.indices.push(idx + 3);
      this.indices.push(idx + 1);
      this.indices.push(idx + 3);
      this.indices.push(idx + 2);
    }
    this.geometry.setIndex(this.indices);

    // Property 설정
    this.props = {
      position: new Float32Array(count * 4 * 3),
      halfPosition: new Float32Array(count * 4 * 3),
      pivot: new Float32Array(count * 4 * 3),
      color: new Float32Array(count * 4 * 4).fill(1),
      width: new Int16Array(count * 4).fill(1),
    };

    // Attribute 설정
    this.attr = {
      position: new BufferAttribute(this.props.position, 3),
      halfPosition: new BufferAttribute(this.props.halfPosition, 3),
      pivot: new BufferAttribute(this.props.pivot, 3),
      color: new BufferAttribute(this.props.color, 4),
      width: new BufferAttribute(this.props.width, 1),
    };

    // Attribute 등록
    this.attr.position.name = 'position';
    this.attr.halfPosition.name = 'halfPosition';
    this.attr.pivot.name = 'pivot';
    this.attr.color.name = 'color';
    this.attr.width.name = 'width';

    this.geometry.addAttribute('position', this.attr.position);
    this.geometry.addAttribute('halfPosition', this.attr.halfPosition);
    this.geometry.addAttribute('pivot', this.attr.pivot);
    this.geometry.addAttribute('color', this.attr.color);
    this.geometry.addAttribute('width', this.attr.width);


    // Materia & Mesh 설정
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        sineTime: { value: 1.0 }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // 오브젝트 생성
    for (let i = 0; i < count; i++) {
      this._objects.push(new LineObject(this, i, this.props));
    }
  }


  public allocateUpdateObject(updateObject: LineObject<T>) {
    this.updateReservedObjects[updateObject.index] = updateObject;
  }

  public completedUpdateObject(updateObject: LineObject<T>) {
    this.removeReservedIndices.push(updateObject.index);
  }

  public onRender() {
    // TODO
  }

  public onUpdate() {
    // check update.
    this.attr.position.needsUpdate = true;
    const keys = Object.keys(this.updateReservedObjects);
    if (keys.length !== 0) {
      // this.attr.position.needsUpdate = true;
      // this.attr.halfPosition.needsUpdate = true;
      // this.attr.color.needsUpdate = true;
      // this.attr.width.needsUpdate = true;
      // this.attr.pivot.needsUpdate = true;
      console.log('update', keys.length);
    }

    keys.forEach(index => this.updateReservedObjects[index].update());
    this.removeReservedIndices.forEach(index =>
      delete this.updateReservedObjects[index]);
    this.removeReservedIndices = [];


  }

}
