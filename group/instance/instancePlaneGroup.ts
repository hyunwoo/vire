import InstanceGroup from './instanceGroup';
import * as THREE from 'three';


export default class InstancePlaneGroup extends InstanceGroup {

  public constructor(
    scene: THREE.Scene,
    count: number,
    width?: number,
    height?: number,
    widthSegements?: number,
    heightSegements?: number) {
    super(scene, count, width, height, widthSegements, heightSegements);
  }
  public initInstanceGeometry(
    geometry: THREE.InstancedBufferGeometry,
    width?: number,
    height?: number,
    widthSegements?: number,
    heightSegements?: number) {
    const geo = new THREE.PlaneBufferGeometry(width, height, widthSegements, heightSegements);
    geometry.index = geo.index;
    geometry.addAttribute('instancePosition', geo.attributes.position);
    geometry.addAttribute('instanceNormal', geo.attributes.normal);
    geometry.addAttribute('instanceUV', geo.attributes.uv);
  }
}
