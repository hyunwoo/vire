
import * as THREE from 'three';
import { Color } from 'three';

// export class Transform extends Object3D {
//   public translate(x, y, z) {
//     this.translateX(x);
//     this.translateY(y);
//     this.translateZ(z);
//   }
// }

export class DrawingTransform extends THREE.Object3D {
  public geometry: THREE.BufferGeometry;
  public positions: Float32Array;
  public normals: Float32Array;
  public colors: Float32Array;
  public options: Float32Array;

  public constructor(triangles: number) {
    super();
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(triangles * 3);
    this.normals = new Float32Array(triangles * 3);
    this.colors = new Float32Array(triangles * 3);
    this.options = new Float32Array(triangles * 3);
    this.geometry.addAttribute('position',
      new THREE.BufferAttribute(this.positions, 3).setDynamic(true));
    this.geometry.addAttribute('normal',
      new THREE.BufferAttribute(this.normals, 3));
    this.geometry.addAttribute('color',
      new THREE.BufferAttribute(this.colors, 3));

    const material = new THREE.MeshPhongMaterial({
      color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
      side: THREE.DoubleSide, vertexColors: THREE.VertexColors
    });
    this.positions[0] = 0;
    this.positions[1] = 0;
    this.positions[2] = 0;

    this.positions[3] = 0;
    this.positions[4] = 0;
    this.positions[5] = 300;

    this.positions[6] = 0;
    this.positions[7] = 300;
    this.positions[8] = 0;

    const c = new Color('#ff0000');

    this.colors[0] = c.r;
    this.colors[1] = c.g;
    this.colors[2] = c.b;

    this.colors[3] = c.r;
    this.colors[4] = c.g;
    this.colors[5] = c.b;

    this.colors[6] = c.r;
    this.colors[7] = c.g;
    this.colors[8] = c.b;

    this.add(new THREE.Mesh(this.geometry, material));
  }

  // TODO
  public line() {
    // TODO
  }
}
