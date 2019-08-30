import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Object3D, Vector3 } from 'three';
import { DrawingTransform } from './transform';
import InstanceGroup from './group/instance/instanceGroup';
import RenderGroup from './group/base/renderGroup';
import _ from 'lodash';
import LineGroup from './group/line/lineGroup';


/**
 * 전체적인것을 다 할 필요는 없다.
 * 즉, 3D Object 를 띄우거나 하는것은 테스트로 충분
 *
 * 반드시 해야하는것 먼저 한다
 *
 * TODOS
 * 1. 기본도형 그리기
 * 2. 기본도형 커스터마이징
 * 3. position, scale 등에 대한 animation
 * 4. shader
 */

class VL {
  public camera: THREE.Camera;
  public renderer: THREE.WebGLRenderer;
  public width: number;
  public height: number;
  public scene: THREE.Scene;
  public renderGroups: Array<RenderGroup<THREE.Object3D>> = [];
  private controller: OrbitControls;
  private stats: Stats;

  public constructor(parent: HTMLElement) {

    this.width = parent.clientWidth;
    this.height = parent.clientHeight;
    // init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    parent.appendChild(this.renderer.domElement);
    console.log(`W : ${this.width}, H : ${this.height}`);
    // init scene
    this.scene = new THREE.Scene();

    // init camera
    // this.camera =
    // new THREE.PerspectiveCamera(70, this.width / this.height, 0.001, 100);

    this.camera = new THREE.OrthographicCamera(-this.width / 2,
      this.width / 2, this.height / 2, -this.height / 2, -10000, 10000);
    this.camera.position.z = 2;



    // 보편적인 시각화에 라이팅은 필요하지 않으므로 우선 제거
    // const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    // const pointLight = new THREE.PointLight(0xffffff, 0.8);
    // pointLight.translateX(1000);
    // pointLight.translateY(200);
    // pointLight.translateZ(-300);
    // this.scene.add(ambientLight);
    // this.scene.add(pointLight);
    // 라이트 끝

    this.scene.add(this.camera);
    // const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // controls.enablePan = true;
    // controls.enableRotate = false;

    // const constrols = new DragControls(this.camera, this.renderer.domElement);
    // controls.addEventListener('change', render);

    this.render();
    console.log(this.scene);
    requestAnimationFrame(this.render.bind(this));


    console.log('VL CREATED');

    this.camera.up = new Vector3(0, 0, 1);
    this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    this.controller.enableRotate = false;


    // Stat
    this.stats = new Stats();
    parent.appendChild(this.stats.dom);
  }

  public createInstanceGroup(unit: THREE.BufferGeometry, count: number) {
    const ig = new InstanceGroup(this.scene, unit, count);
    ig.attachToScene();
    this.renderGroups.push(ig);
    return ig;
  }
  public createLineGroup(count: number) {
    const bg = new LineGroup(this.scene, [
      -50, 0, 0, 50, 0, 0,
      -50, 10, 0, 50, 10, 0
    ], count);
    bg.attachToScene();
    this.renderGroups.push(bg);
    console.log(this.scene);
    return bg;
  }

  public addRenderGroup(renderGroup: RenderGroup<THREE.Object3D>) {
    this.renderGroups.push(renderGroup);
  }

  public removeRenderGroup(renderGroup: RenderGroup<THREE.Object3D>) {
    return this.removeRenderGroupById(renderGroup.id);
  }
  public removeRenderGroupById(id: string) {
    const index = _.findIndex(this.renderGroups, o => o.id === id);
    if (index >= 0) {
      const group = this.renderGroups[index];
      group.detachToScene();
      this.renderGroups.splice(index, 1);
      return group;
    } else {
      throw new Error(`[Group not found] ${id}에 해당하는 그룹을 찾을 수 없습니다.`);
    }

  }
  public addObject() {
    // add object
    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });
    const object = new THREE.Mesh(new THREE.SphereBufferGeometry(75, 20, 10), material);
    object.position.set(0, 0, 0);
    const o: Object3D = new Object3D();
    this.scene.add(object);
    const t = new DrawingTransform(3);
    console.log(t.geometry);
    this.scene.add(t);
  }
  private render() {
    requestAnimationFrame(this.render.bind(this));
    this.onRender();
  }
  private onRender() {
    this.camera.lookAt(this.scene.position);

    for (const g of this.renderGroups) {
      g.onUpdate();
    }
    for (const g of this.renderGroups) {
      g.onRender();
    }
    if (this.stats && this.stats.update !== undefined) {
      this.stats.update();
    }
    // console.log(stats.update());

    if (this.controller && this.controller.update !== undefined) {
      this.controller.enableRotate = false;
      this.controller.update();
    }

    this.renderer.render(this.scene, this.camera);
  }
}

export default VL;

