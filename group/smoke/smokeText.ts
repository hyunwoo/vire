import VIRE from '@/vire';
import SmokeGroup from './smokeGroup';

export interface SmokeTextOptions {
  canvasWidth: number;
  canvasHeight: number;
  maxParticleCount: number;

}
export default class SmokeText {
  private context: CanvasRenderingContext2D;
  private options: SmokeTextOptions = {
    canvasWidth: 800,
    canvasHeight: 300,
    maxParticleCount: 30000,
  };
  private group: SmokeGroup;
  private vire: VIRE;
  private canvas: HTMLCanvasElement;


  public constructor(vire: VIRE, options?: Partial<SmokeTextOptions>) {
    if (options === undefined) {
      options = {};
    }

    Object.assign(this.options, options);
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', '' + this.options.canvasWidth);
    this.canvas.setAttribute('height', '' + this.options.canvasHeight);
    this.canvas.style.opacity = '0';
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
    this.vire = vire;

    const context = this.canvas.getContext('2d');
    if (context === null) {
      throw new Error('캔버스 객체를 생성하지 못했습니다.');
    } else {
      console.log(context);
      this.context = context;
    }
    console.log(this.options.canvasWidth,
      this.options.canvasHeight);
    this.group = vire.createGroup(SmokeGroup, this.options.maxParticleCount);
  }

  public set flowSpeed(value: number) {
    this.group.setUniform('flowSpeed', value);
  }
  public get isPlayable() {
    return this.group.canChangeState;
  }

  public addText(
    text: string,
    x: number,
    y: number,
    options?: Partial<CanvasTextDrawingStyles> | Partial<CanvasFillStrokeStyles> | Partial<CanvasFilters>) {

    // TODO 초기화 고민
    // const defaults: Partial<CanvasTextDrawingStyles> | Partial<CanvasFillStrokeStyles> | Partial<CanvasFilters> = {
    //   direction : 'ltr',
    //   }
    Object.assign(this.context, options);
    this.context.fillText(text, x, y);
  }
  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  public reverse(): Promise<void> {
    if (!this.group.canChangeState) {
      throw new Error('재생 상태를 변경 할 수 없습니다.');
    }
    this.group.state = 'reverse';
    return new Promise(resolve => {
      this.group.onStateChange = state => {
        if (state === 'stop') {
          resolve();
        }
      };
    });
  }
  public play(duration?: number): Promise<void> {
    if (!this.group.canChangeState) {
      throw new Error('재생 상태를 변경 할 수 없습니다.');
    }
    this.group.state = 'play';
    this.group.objects.forEach(o => {
      const c = o.color;
      c.a = 0;
      o.color = c;
    });

    this.group.animationDuration = duration !== undefined ? duration : 3;
    const imageData = this.context.getImageData(0, 0,
      this.options.canvasWidth, this.options.canvasHeight);

    const particleData: Array<{
      index: number, color: [number, number, number, number]
    }> = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] > 0) {
        particleData.push({
          index: i / 4,
          color: [
            imageData.data[i] / 255,
            imageData.data[i + 1] / 255,
            imageData.data[i + 2] / 255,
            imageData.data[i + 3] / 255],
        });
      }

    }
    const objects = this.group.objects;

    particleData.forEach((d, i) => {
      const o = objects[i];
      o.setAnimationSpeed(1);
      o.size = {
        x: 1
      };

      o.position = {
        x: d.index % this.options.canvasWidth - this.vire.width / 2,
        y: Math.floor(d.index / this.options.canvasWidth) - this.vire.height / 2
      };
      o.color = {
        r: d.color[0],
        g: d.color[1],
        b: d.color[2],
        a: d.color[3],
      };
    });
    return new Promise(resolve => {
      this.group.onStateChange = state => {
        if (state === 'stop') {
          resolve();
        }
      };
    });
  }
}
