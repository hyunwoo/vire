import { v1 as uuid } from 'uuid';
import * as THREE from 'three';
import { GroupAnimation, ShapeProperties, RenderGroupAttributes, RenderProperties } from './index';
import RenderObject from './renderObject';



export default abstract class RenderGroup<
  P extends ShapeProperties, R extends RenderObject<P>> {
  public readonly id: string;
  protected readonly material: THREE.Material;
  protected readonly geometry: THREE.BufferGeometry;
  protected readonly attr: RenderGroupAttributes<P>;
  protected readonly props: RenderProperties<P>;
  protected readonly _objects: R[] = [];
  protected readonly propertyKeys: Array<keyof P>;
  protected readonly unit: P;
  protected scene: THREE.Scene;
  protected mesh!: THREE.Object3D;
  protected generateCount: number = 0;
  protected unitVertCount: number = 0;
  protected camera!: THREE.Camera;
  protected width: number = 0;
  protected height: number = 0;
  protected raycaster: THREE.Raycaster = new THREE.Raycaster();

  protected readonly _shaderProperties: THREE.ShaderMaterialParameters = {
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: false
  };

  protected animation: GroupAnimation = {
    use: true,
    animationLerpValue: 0.1,
  };

  private updateReservedObjects: { [key: number]: R } = {};
  private removeReservedIndices: number[] = [];

  /**
   * @description
   * R extends ShapeProperties 를 기반으로 한 RenderObject 배열을 제공
   * 해당 오브젝트에 접근하여 도형을 제어 할 수 있다.
   */
  public get objects(): R[] {
    return this._objects;
  }


  /**
   * @description
   * BufferGeometry 기반으로 다량의 오브젝트를 관리하는 그룹.
   * ShapeProperties를 extends한 기본 도형의 정보를 바탕으로 RenderObject를 제공하고,
   * Collision Detect, Material 등을 설정 할 수 있다.
   * @param scene
   * @param unit
   */
  public constructor(
    scene: THREE.Scene, unit: P);
  /**
   *
   * @param scene
   * @param unit
   * @param geometry
   * @param mesh
   */
  public constructor(
    scene: THREE.Scene, unit: P,
    geometry: new () => THREE.BufferGeometry,
    mesh: new () => THREE.Object3D);
  /**
   *
   * @param scene
   * @param unit
   * @param geometry
   * @param mesh
   */
  public constructor(
    scene: THREE.Scene, unit: P,
    geometry?: new () => THREE.BufferGeometry,
    mesh?: new (geometry: THREE.BufferGeometry, material: THREE.Material) => THREE.Object3D) {

    this.propertyKeys = Object.keys(unit);
    geometry = geometry ? geometry : THREE.BufferGeometry;
    mesh = mesh ? mesh : THREE.Mesh;
    this.geometry = new geometry();
    this.unit = unit;
    // @ts-ignore 초기화 필요
    this.attr = {};
    // @ts-ignore 초기화 필요
    this.props = {};
    this.material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
    this.mesh = new mesh(this.geometry, this.material);
    // attach
    this.scene = scene;
    this.id = uuid();
    this.scene.add(this.mesh);
  }

  public get shaderProperties() {
    return this._shaderProperties;
  }

  /**
   * @description
   * Shader에서 사용하는 Property를 추가함.
   * 이후 setMaterial을 호출하여 메테리얼을 적용 하여야 한다.
   * @param props
   */
  public addShaderProperties(props: Partial<THREE.ShaderMaterialParameters>) {
    Object.assign(this._shaderProperties, props);
    return this;
  }

  /**
   * @description
   * Shader에서 사용하는 Property를 삭제함.
   * 이후 setMaterial을 호출하여 메테리얼을 적용 하여야 한다.
   * @param props
   */
  public deleteShaderProperties(props: Array<keyof THREE.ShaderMaterialParameters>) {
    for (const prop of props) {
      if (this._shaderProperties[prop]) {
        delete this._shaderProperties[prop];
      }
    }
  }

  /**
   * @description
   * Material을 적용한다.
   * 인자가 없을 경우, 현재 설정된 ShaderProperty를 이용하여 Material을 생성한다.
   * @param props
   */
  public applyMaterial(material?: THREE.Material) {
    const target: THREE.Mesh = this.mesh as THREE.Mesh;
    if (target.material) {
      target.material = material ? material : new THREE.RawShaderMaterial(this._shaderProperties);
    }
    return this;
  }

  public setCollisionProperties(camera: THREE.Camera, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera = camera;
    return this;
  }



  /**
   * 화면 마우스 좌표 입력시, 오브젝트를 리턴
   * @param x
   * @param y
   */
  public intersects(x: number, y: number): Array<RenderObject<P>> {

    x = x / this.width * 2 - 1;
    y = -(y / this.height * 2 - 1);
    const point = new THREE.Vector2(x, y);
    this.geometry.computeBoundingSphere();
    this.raycaster.setFromCamera(point, this.camera);
    this.raycaster.linePrecision = 5;

    // TODO
    // 1. 카메라 조정
    // 2. 인덱스 설정하여 오브젝트 리턴
    // 3. Indices로 렌더링 될 시
    const objs = this.raycaster.intersectObject(this.mesh);
    if (objs.length !== 0 && objs[0].index) {
      console.log(objs[0].index);
    } else if (objs.length !== 0) {
      console.log(objs);
    }

    return [];
  }

  /**
   * @description
   * 생성시 설정된 scene에 group을 추가한다. (생성시 등록 되어 있는 상태)
   */
  public attachToScene() {
    this.scene.add(this.mesh);
  }

  /**
   * @description
   * 생성시 설정된 scene에서 group을 때어낸다.
   */
  public detachToScene() {
    this.scene.remove(this.mesh);
  }

  /**
   * @description
   * 업데이트가 필요한 RenderObject를 추가한다.
   * *해당 오브젝트는 {@link completedUpdateObject} 함수가 호출되기 전까지 update를 수행한다.
   * @param updateObject
   */
  public allocateUpdateObject(updateObject: R) {
    this.updateReservedObjects[updateObject.index] = updateObject;
  }

  /**
   * 업데이트가 완료된 RenderObject를 전달하여 더이상 update가 수행 되지 않도록 한다.
   * @param updateObject
   */
  public completedUpdateObject(updateObject: R) {
    this.removeReservedIndices.push(updateObject.index);
  }

  public update() {

    const keys = Object.keys(this.updateReservedObjects);

    keys.forEach(index => {
      this.updateReservedObjects[index].update();
    });
    if (keys.length !== 0) {
      for (const property of this.propertyKeys) {
        this.attr[property].needsUpdate = true;
      }
    }

    // this.geometry.computeBoundingBox();
    // this.geometry.computeVertexNormals();
    this.removeReservedIndices.forEach(index =>
      delete this.updateReservedObjects[index]);
    this.removeReservedIndices = [];

    this.onUpdate();


  }



  public render() {
    this.onRender();
  }

  public abstract onUpdate(): void;
  public abstract onRender(): void;

  /**
   * @description
   * RenderGroup 초기화.
   *
   * @param generateCount 최대 생성할 도형의 개수
   * @param unitVertCount 한 도형 당 존재하는 정점의 개수
   */
  protected initializeAttributes(
    generateCount: number,
    unitVertCount: number,
    attributeType?: new (array: ArrayLike<number>, itemSize: number) => THREE.BufferAttribute) {
    this.generateCount = generateCount;
    this.unitVertCount = unitVertCount;
    for (const key of this.propertyKeys) {
      // @ts-ignore readonly 이지만 초기화 하기위한 방법이 마땅하지 않음.
      this.props[key] = new Float32Array(this.unit[key] * generateCount * unitVertCount);
    }
    attributeType = attributeType ? attributeType : THREE.BufferAttribute;

    for (const key of this.propertyKeys) {
      // @ts-ignore readonly 이지만 초기화 하기위한 방법이 마땅하지 않음.
      this.attr[key] = new attributeType(this.props[key], this.unit[key]);
      this.attr[key].name = key as string;
      this.geometry.addAttribute(key as string, this.attr[key]);
      this.attr[key].needsUpdate = true;
    }
    return this;
  }

  /**
   * @description
   * 단위 도형이 삼각형 이상 일 경우, index를 사용 할 수 있음.
   * 도형 하나 기준으로 그려지는 정점의 순서를 배열로 입력
   *
   * @param index
   */
  protected setIndex(index: number[]) {
    if (!index || index.length === 0) {
      throw new Error('인덱스 크기와 도형 정점의 단위 크기가 다릅니다.');
    }
    const indices: number[] = [];
    for (let i = 0; i < this.generateCount; i++) {
      for (const val of index) {
        indices.push(val + this.unitVertCount * i);
      }
    }
    this.geometry.setIndex(indices);
    return this;
  }

  /**
   * @deprecated set index 함수와 createObjects 함수가 해당 역할을 대체 할 수 있음.
   * @param object
   * @param index
   */

  protected createIndicesObjects(
    object: new (
      parent: RenderGroup<P, any>,
      unit: P,
      props: RenderProperties<P>,
      index: number,
      unitVertCount: number,
    ) => R,
    index: number[],
  ) {
    for (let i = 0; i < this.generateCount; i++) {
      this.objects.push(new object(this, this.unit, this.props, i, this.unitVertCount));
    }
  }

  protected createObjects(object: new (
    parent: RenderGroup<P, any>,
    unit: P,
    props: RenderProperties<P>,
    index: number,
    unitVertCount: number,
  ) => R) {
    for (let i = 0; i < this.generateCount; i++) {
      this.objects.push(new object(this, this.unit, this.props, i, this.unitVertCount));
    }
  }
}
