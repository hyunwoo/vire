import { BufferGeometry } from 'three';

export class BufferedObject {
  public geometry: BufferGeometry;
  public constructor() {
    this.geometry = new BufferGeometry();
  }
}
