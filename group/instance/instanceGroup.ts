import * as THREE from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
import fs from '!!raw-loader!./default.frag';
import RenderGroup from '../base/renderGroup';
import _ from 'lodash';
import Helper from '../../helper';
import { ReserveAttribute } from '../base';


interface GroupAttributes {
  position: THREE.BufferAttribute;
  rotation: THREE.BufferAttribute;
  scale: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
}
export default class InstanceGroup extends RenderGroup<THREE.Mesh> {

  // initailizeShape에서 초기화
  private instanceGeometry!: THREE.InstancedBufferGeometry;

  private tick = 0;
  // TODO Animation은 변경하는 인덱스에 대해서만 수행

  private animate: boolean = false;
  private animationAmount: number = 1;
  private positions: Float32Array;
  private colors: Float32Array;
  private scales: Float32Array;
  private rotation: Float32Array;
  private attributes: GroupAttributes;

  public constructor(scene: THREE.Scene, shape: THREE.BufferGeometry, count: number) {
    super(scene, count);
    this.positions = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 4);
    this.scales = new Float32Array(count * 3);
    this.rotation = new Float32Array(count * 4);
    this.scales.fill(1);
    this.colors.fill(1);
    this.positions.fill(0);
    this.rotation.fill(0);


    this.attributes = {
      position: new THREE.InstancedBufferAttribute(this.positions, 3),
      color: new THREE.InstancedBufferAttribute(this.colors, 4),
      scale: new THREE.InstancedBufferAttribute(this.scales, 3),
      rotation: new THREE.InstancedBufferAttribute(this.rotation, 4),
    };


    this.instanceGeometry = new THREE.InstancedBufferGeometry();
    this.instanceGeometry.index = shape.index;
    this.instanceGeometry.maxInstancedCount = count;
    this.instanceGeometry.addAttribute('position', shape.attributes.position);
    this.instanceGeometry.addAttribute('color', this.attributes.color);
    this.instanceGeometry.addAttribute('translate', this.attributes.position);
    this.instanceGeometry.addAttribute('rotation', this.attributes.rotation);
    this.instanceGeometry.addAttribute('scale', this.attributes.scale);

    const quat = new THREE.Quaternion();
    const euler = new THREE.Euler();
    // material
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
      depthTest: false,
      flatShading: true
    });
    //
    this.mesh = new THREE.Mesh(this.instanceGeometry, this.material);
    console.log('mesh', this.mesh);
  }
  // public set animate(use: boolean) {
  //   if (use) {
  //     this.positions
  //   }
  // }

  public setAnimtaion(use: boolean, amount?: number) {
    this.animationAmount = amount ? amount : 0.1;
    this.animate = use;
  }




  public onRender() {
    // TODO
  }

  public onUpdate() {
    this.updateBufferAttribute(this.attributes.position, this.reserve.positions, 3);
    this.updateBufferAttribute(this.attributes.scale, this.reserve.scales, 3);
    this.updateBufferAttribute(this.attributes.color, this.reserve.colors, 4);
    this.updateBufferAttribute(this.attributes.rotation, this.reserve.rotations, 4);
  }




  public color(index: number, color: THREE.Color, opacity?: number, lerpAmount?: number): void;
  public color(index: number, r: number, g: number, b: number, opacity?: number, lerpAmount?: number): void;
  public color(index: number, r: number | THREE.Color, g?: number, b?: number, opacity?: number, lerpAmount?: number) {
    if (index >= this.count) {
      throw new Error(`[Index overflow] ${index}번째 오브젝트에 접근하였습니다. 생성된 오브젝트 갯수 : ${this.count}`);
    }
    if (r instanceof THREE.Color) {
      // console.log('here THREE', g);
      const color = r;
      const opa = (g || g === 0) ? g : 1;
      const lAmount = b ? b : (this.animation.use ? this.animation.animationLerpValue : 0);
      this.reserve.colors[index] = {
        values: [color.r,
        color.g,
        color.b,
          opa
        ],
        complete: false,
        lerpAmount: lAmount,
      };
    } else {

      this.reserve.colors[index] = {
        values: [r ? r : 0,
        g ? g : 0,
        b ? b : 0,
        (opacity || opacity === 0) ? opacity : 1],
        complete: false,
        lerpAmount: lerpAmount ? lerpAmount : (this.animation.use ? this.animation.animationLerpValue : 0)
      };
      // console.log(this.reserve.colors);
    }
  }

  public rotate(index: number, quat: THREE.Quaternion, lerpAmount?: number): void;
  public rotate(index: number, x: number, y: number, z: number, lerpAmount?: number): void;
  public rotate(index: number, x: THREE.Quaternion | number, y?: number, z?: number, w?: number, lerpAmount?: number) {
    if (index >= this.count) {
      throw new Error(`[Index overflow] ${index}번째 오브젝트에 접근하였습니다. 생성된 오브젝트 갯수 : ${this.count}`);
    }

    if (x instanceof THREE.Quaternion) {
      const lAmount = y ? y : (this.animation.use ? this.animation.animationLerpValue : 0);
      this.reserve.rotations[index] = {
        values: [x.x,
        x.y,
        x.z,
        x.w],
        complete: false,
        lerpAmount: lAmount
      };
    } else {

      const quat = new THREE.Quaternion();
      quat.setFromEuler(new THREE.Euler(x, y, z));
      this.reserve.rotations[index] = {
        values: [quat.x,
        quat.y,
        quat.z,
        quat.w],
        complete: false,
        lerpAmount: lerpAmount ? lerpAmount : (this.animation.use ? this.animation.animationLerpValue : 0)
      };
    }
  }

  public transpose(index: number, vec: THREE.Vector3, lerpAmount?: number): void;
  public transpose(index: number, x: number, y: number, z: number, lerpAmount?: number): void;
  public transpose(index: number, x: THREE.Vector3 | number, y?: number, z?: number, lerpAmount?: number) {
    if (index >= this.count) {
      throw new Error(`[Index overflow] ${index}번째 오브젝트에 접근하였습니다. 생성된 오브젝트 갯수 : ${this.count}`);
    }
    if (x instanceof THREE.Vector3) {
      const lAmount = y ? y : (this.animation.use ? this.animation.animationLerpValue : 0);
      this.reserve.positions[index] = {
        values: [x.x,
        x.y,
        x.z],
        complete: false,
        lerpAmount: lAmount
      };
    } else {
      this.reserve.positions[index] = {
        values: [x,
          y ? y : 0,
          z ? z : 0],
        complete: false,
        lerpAmount: lerpAmount ? lerpAmount : (this.animation.use ? this.animation.animationLerpValue : 0)
      };
    }
  }

  public move(index: number, vec: THREE.Vector3, lerpAmount?: number): void;
  public move(index: number, x: number, y: number, z: number, lerpAmount?: number): void;
  public move(index: number, x: THREE.Vector3 | number, y?: number, z?: number, lerpAmount?: number) {
    if (index >= this.count) {
      throw new Error(`[Index overflow] ${index}번째 오브젝트에 접근하였습니다. 생성된 오브젝트 갯수 : ${this.count}`);
    }
    if (x instanceof THREE.Vector3) {
      const lAmount = y ? y : (this.animation.use ? this.animation.animationLerpValue : 0);
      this.reserve.positions[index] = {
        values: [
          this.positions[index * 3] + x.x,
          this.positions[index * 3 + 1] + x.y,
          this.positions[index * 3 + 2] + x.z],
        complete: false,
        lerpAmount: lAmount,
      };

    } else {

      this.reserve.positions[index] = {
        values: [this.positions[index * 3] + x,
        this.positions[index * 3 + 1] + (y ? y : 0),
        this.positions[index * 3 + 2] + (z ? z : 0)],
        complete: false,
        lerpAmount: lerpAmount ? lerpAmount : (this.animation.use ? this.animation.animationLerpValue : 0)
      };
    }
    this.attributes.position.needsUpdate = true;
  }

  public size(index: number, vec: THREE.Vector3, lerpAmount?: number): void;
  public size(index: number, x: number, y: number, z?: number, lerpAmount?: number): void;
  public size(index: number, x: THREE.Vector3 | number, y?: number, z?: number, lerpAmount?: number) {
    if (index >= this.count) {
      throw new Error(`[Index overflow] ${index}번째 오브젝트에 접근하였습니다. 생성된 오브젝트 갯수 : ${this.count}`);
    }
    if (x instanceof THREE.Vector3) {
      const lAmount = y ? y : (this.animation.use ? this.animation.animationLerpValue : 0);
      this.reserve.scales[index] = {
        values: [x.x,
        x.y,
        x.z],
        complete: false,
        lerpAmount: lAmount,
      };
    } else {
      this.reserve.scales[index] = {
        values: [x,
          y ? y : 0,
          z ? z : 0],
        complete: false,
        lerpAmount: lerpAmount ? lerpAmount : (this.animation.use ? this.animation.animationLerpValue : 0)
      };
    }
  }

  protected updateBufferAttribute(
    source: THREE.BufferAttribute,
    reserve: ReserveAttribute,
    lerpLength: number,
    threshold?: number) {
    if (_.isEmpty(reserve)) {
      return;
    } else {
      source.needsUpdate = true;
    }
    const thres = threshold ? threshold : 0.001;
    if (threshold === undefined) {
      threshold = 0.001;
    }
    const removeIndices: string[] = [];
    _.forEach(reserve, (res, index) => {
      const dist = Helper.math.lerpOnArray(source.array as Float32Array,
        Number(index),
        res.values as number[], lerpLength, res.lerpAmount);
      if (dist < thres) {
        res.complete = true;
        removeIndices.push(index);
      }
    });
    _.forEach(removeIndices, index => {
      delete reserve[index];
    });
  }

}
