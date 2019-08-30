import { v1 as uuid } from 'uuid';
import * as THREE from 'three';
import { GroupAnimation, ReserveAttribute } from './index';

export default abstract class RenderGroup<T extends THREE.Object3D> {
  public id: string;
  protected scene: THREE.Scene;
  protected mesh!: T;
  protected material: THREE.Material = new THREE.MeshBasicMaterial();
  protected count: number;
  protected animation: GroupAnimation = {
    use: true,
    animationLerpValue: 0.1,
  };

  protected reserve: {
    positions: ReserveAttribute
    colors: ReserveAttribute
    scales: ReserveAttribute
    rotations: ReserveAttribute
  } = { positions: {}, colors: {}, scales: {}, rotations: {} };

  public constructor(scene: THREE.Scene, count: number) {
    this.count = count;
    this.scene = scene;
    this.id = uuid();
  }

  public attachToScene() {
    this.scene.add(this.mesh);
  }
  public detachToScene() {
    this.scene.remove(this.mesh);
  }
  public abstract onUpdate(): void;
  public abstract onRender(): void;
}
