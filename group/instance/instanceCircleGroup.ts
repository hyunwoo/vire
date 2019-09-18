import InstanceGroup from './instanceGroup';
import * as THREE from 'three';


export default class InstanceCircleGroup extends InstanceGroup {

  public constructor(scene: THREE.Scene, count: number, radius?: number, segements?: number) {
    super(scene, count, radius ? radius : 1, segements ? segements : 12);
  }
  public initInstanceGeometry(
    geometry: THREE.InstancedBufferGeometry,
    radius: number,
    segements: number) {
    const geo = new THREE.CircleBufferGeometry(radius, segements);
    geometry.index = geo.index;
    geometry.addAttribute('instancePosition', geo.attributes.position);
    geometry.addAttribute('instanceNormal', geo.attributes.normal);
    geometry.addAttribute('instanceUV', geo.attributes.uv);
  }
}
