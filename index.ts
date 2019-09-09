import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Vector3, Group } from 'three';
import _ from 'lodash';
import LineSegementGroup from './group/lineSegement/lineSegementGroup';
import RenderGroup from './group/base/renderGroup';
import RectangleGroup from './group/rectangle/rectangleGroup';
import debounce from 'lodash/debounce';
import InstanceGroup from './group/instance/instanceGroup';
import InstancePlaneGroup from './group/instance/instancePlaneGroup';


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

interface VLMouse {
  clientX: number;
  clientY: number;
  x: number;
  y: number;
  pressed: boolean;
  clicked: boolean;
}
class VL {
  public readonly camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  public readonly renderer: THREE.WebGLRenderer;
  public readonly element: HTMLElement;
  public width: number;
  public height: number;
  public readonly scene: THREE.Scene;
  public readonly renderGroups: Array<RenderGroup<any, any>> = [];
  public readonly raycaster: THREE.Raycaster = new THREE.Raycaster();
  public mouse: VLMouse = {
    clientX: 0,
    clientY: 0,
    x: 0,
    y: 0,
    pressed: false,
    clicked: false,
  };
  private orbitController: OrbitControls | undefined;
  private stats: Stats;
  private is3D: boolean;


  public set onUpdate(func: () => void) {
    this._update = func;
  }
  public set onRenderFinished(func: () => void) {
    this._rendered = func;
  }
  private _beforeUpdate: () => void;
  private _update: () => void;
  private _rendered: () => void;

  public constructor(element: HTMLElement, use3D?: boolean) {
    this.element = element;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    this.is3D = use3D ? use3D : false;

    // event checked
    this._beforeUpdate = () => {/** empty */ };
    this._update = () => { /** empty */ };
    this._rendered = () => {/** empty */ };

    // init renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    element.appendChild(this.renderer.domElement);
    // init scene
    this.scene = new THREE.Scene();
    // this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 10000);
    if (this.is3D) {
      this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 1, 10000);
      this.camera.position.z = 500;
    } else {
      this.camera = new THREE.OrthographicCamera(
        -this.width / 2,
        this.width / 2,
        -this.height / 2,
        this.height / 2,
        -10000, 10000);
      this.camera.position.z = 500;
    }
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
    this.render();
    requestAnimationFrame(this.render.bind(this));

    this.camera.up = new Vector3(0, 0, 1);
    // this.controller = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controller.enableRotate = false;

    // Stat
    this.stats = new Stats();
    element.appendChild(this.stats.dom);
    element.addEventListener('mousemove', this.mouseMove.bind(this));
    window.addEventListener('resize', debounce(this.resize.bind(this), 100), false);
  }
  public createGroup<G extends RenderGroup<any, any>>(
    type: new (scene: THREE.Scene, count: number) => G,
    count: number) {
    const group = new type(this.scene, count)
      .setCollisionProperties(this.camera, this.width, this.height);
    this.renderGroups.push(group);
    return group;
  }
  public createPlaneInstanceGroup(
    meshCount: number,
    radius: number,
    segements: number) {
    const group = new InstancePlaneGroup(this.scene, meshCount, radius, segements)
      .setCollisionProperties(this.camera, this.width, this.height);
    this.renderGroups.push(group);
    return group;
  }
  public createInstanceGroup<G extends InstanceGroup>(
    type: new (scene: THREE.Scene, count: number) => G,
    count: number,
  ) {
    const group = new type(this.scene, count)
      .setCollisionProperties(this.camera, this.width, this.height);
    this.renderGroups.push(group);
    return group;
  }

  public createLineSegementGroup(count: number) {
    const lg = new LineSegementGroup(this.scene, count)
      .setCollisionProperties(this.camera, this.width, this.height);
    this.renderGroups.push(lg);
    return lg;
  }
  public createRectangleGroup(count: number) {
    const rg = new RectangleGroup(this.scene, count)
      .setCollisionProperties(this.camera, this.width, this.height);
    this.renderGroups.push(rg);
    return rg;
  }
  public setBackgroundColor(hex: string): void;
  public setBackgroundColor(r: number, g: number, b: number): void;
  public setBackgroundColor(r: string | number, g?: number, b?: number) {
    this.scene.background = new THREE.Color(...arguments);
  }

  public resize() {
    const aspect = this.element.clientWidth / this.element.clientHeight;
    this.width = this.element.clientWidth;
    this.height = this.element.clientHeight;

    if (this.camera instanceof (THREE.OrthographicCamera)) {
      this.camera.left = -this.width / 2;
      this.camera.top = -this.height / 2;
      this.camera.right = this.width / 2;
      this.camera.bottom = this.height / 2;
    } else {
      const cam = this.camera as THREE.PerspectiveCamera;
      cam.aspect = aspect;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }


  public removeRenderGroup(renderGroup: RenderGroup<any, any>) {
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


  private mouseMove(event: MouseEvent) {
    const pixelBuffer = new Uint8Array(4);
    // this.renderer.readRenderTargetPixels()
    this.mouse.clientX = event.clientX;
    this.mouse.clientY = event.clientY;
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = (event.clientY / this.height) * 2 - 1;

  }

  // TODO 마우스 제어 영역
  private mousePressed(event: MouseEvent) {
    event.preventDefault();
  }
  private mouseDragging(event: MouseEvent) {
    event.preventDefault();
  }
  private mouseDragStart(event: MouseEvent) {
    event.preventDefault();
  }
  private mouseDragEnd(event: MouseEvent) {
    event.preventDefault();
  }
  private mouseClick(event: MouseEvent) {
    event.preventDefault();
  }
  private mouseRelease(event: MouseEvent) {
    event.preventDefault();
  }

  private render() {
    requestAnimationFrame(this.render.bind(this));
    this.onRender();
  }

  private onRender() {
    // this.camera.lookAt(this.scene.position);
    // this.camera.updateMatrixWorld();
    (this.camera as THREE.OrthographicCamera).updateProjectionMatrix();
    this.raycaster.setFromCamera(this.mouse, this.camera);

    for (const g of this.renderGroups) {
      g.update();
    }
    this._update();
    // console.log(arr);
    // this.mouse.pressed = false;
    this.mouse.clicked = false;
    for (const g of this.renderGroups) {
      g.render();
    }
    if (this.stats && this.stats.update !== undefined) {
      this.stats.update();
    }
    // console.log(stats.update());

    this.camera.updateProjectionMatrix();
    if (this.orbitController && this.orbitController.update !== undefined) {
      this.orbitController.enableRotate = false;
      this.orbitController.update();
    }

    this.renderer.render(this.scene, this.camera);
    this._rendered();
  }


}

export default VL;

