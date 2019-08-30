// import * as THREE from 'three';

// // @ts-ignore
// import vs from './node_modules/!!raw-loader!./default.vert';
// // @ts-ignore
// import fs from './node_modules/!!raw-loader!./default.frag';
// import RenderGroup from '../base/renderGroup';
// import _ from 'lodash';
// import Helper from '../../helper';
// import BaseGroup from '../base/baseGroup';
// import { ReserveAttribute } from '../base';

// // TODO BufferGroup에 대한 재정의가 필요하다.

// // @ts-ignore - move 함수를 닫는다.
// export default class LineGroup extends BaseGroup<THREE.Line> {

//   // initailizeShape에서 초기화



//   // protected source: Float32Array;
//   protected sourceLength: number;

//   // TODO Animation은 변경하는 인덱스에 대해서만 수행
//   private material: THREE.Material;
//   private geometry!: THREE.BufferGeometry;


//   public constructor(scene: THREE.Scene, verts: number[], count: number) {
//     super(scene, count * verts.length / 3);
//     // this.initailizeShape(shape);
//     this.geometry = new THREE.BufferGeometry();
//     this.sourceLength = verts.length;
//     // for (let i = 0; i < count; i++) {
//     //   this.positions.set(verts, i * verts.length);
//     // }
//     // this.source = new Float32Array(verts.length);
//     // this.source.set(verts);

//     // this.attributes = {
//     //   position: new THREE.Float32BufferAttribute(this.positions, 3),
//     //   color: new THREE.Float32BufferAttribute(this.colors, 4),
//     //   scale: new THREE.Float32BufferAttribute(this.scales, 3),
//     //   rotation: new THREE.Float32BufferAttribute(this.rotation, 4),
//     // };


//     this.geometry.addAttribute('color', this.attributes.color);
//     this.geometry.addAttribute('position', this.attributes.position);
//     this.geometry.addAttribute('scale', this.attributes.scale);
//     this.geometry.addAttribute('rotation', this.attributes.rotation);

//     // material
//     this.material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
//     //
//     this.mesh = new THREE.Line(this.geometry, this.material);
//   }



//   public onRender() {
//     // TODO
//   }

//   public onUpdate() {
//     // console.log('bg updated');
//     // this.updateBufferAttributes(this.attributes.position, this.reserve.positions, 3);
//     this.updateBufferAttributes(this.attributes.scale, this.reserve.scales, 3);

//     // this.updateBufferAttribute(this.attributes.color, this.reserve.colors, 4, this.animate ? 0.1 : 1, 0.00001);
//     // this.updateBufferAttribute(this.attributes.rotation, this.reserve.rotations, 4, this.animate ? 0.1 : 1);
//   }



//   private updateBufferAttributes(
//     source: THREE.BufferAttribute,
//     reserve: ReserveAttribute,
//     lerpLength: number,
//     threshold?: number) {

//     if (_.isEmpty(reserve)) {
//       return;
//     } else {
//       source.needsUpdate = true;
//     }
//     const thres = threshold ? threshold : 0.001;
//     if (threshold === undefined) {
//       threshold = 0.001;
//     }
//     const removeIndices: string[] = [];
//     _.forEach(reserve, (res, index) => {
//       const vals: number[] = [];

//       console.log('RES', res);
//       for (let i = 0; i < this.sourceLength; i += lerpLength) {
//         for (let j = 0; j < lerpLength; j++) {
//           // @ts-ignore
//           vals.push(this.source[i + j] + res.values[j]);
//         }
//       }



//       (source.array as Float32Array).set(vals, Number(index) * this.sourceLength);

//       removeIndices.push(index);

//     });
//     _.forEach(removeIndices, index => {
//       delete reserve[index];
//     });
//   }
//   private move() {
//     // close move
//   }
// }
