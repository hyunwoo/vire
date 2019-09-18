import ElementObject from './textObject';
import { v4 as uuid } from 'uuid';

export default class ElementGroup {

  public readonly id: string;
  private parent: HTMLElement;
  private element: HTMLElement;
  private childElements: { [key: string]: ElementObject } = {};
  public constructor(parent: HTMLElement, style?: Partial<CSSStyleDeclaration>) {
    this.parent = parent;
    this.element = document.createElement('div');
    this.element.style.zIndex = '100';
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    this.element.style.position = 'absolute';
    this.element.style.left = '0px';
    this.element.style.top = '0px';
    this.element.style.pointerEvents = 'none';
    Object.assign(this.element.style, style);
    this.parent.appendChild(this.element);
    this.id = uuid();
  }

  public get style() {
    return this.element.style;
  }
  public set style(style: Partial<CSSStyleDeclaration>) {
    Object.assign(this.element.style, style);
  }

  /**
   * @description
   * html을 기반으로 Element를 생성.
   * <div>TEXT</div>와 같이 html을 제공하여야 한다.
   * @param template
   * @param position?
   */

  public addElement(template: string, position?: string) {
    position = position ? position : 'absolute';
    const ele = new ElementObject(this, this.element, template);
    this.childElements[ele.id] = ele;
    ele.style.position = position;
    return ele;
  }
  /**
   * @description
   * 문자열을 입력 받아 html element로 생성.
   * 단순 텍스트를 화면에 출력하고자 할때 사용 할 수 있다.
   * @param text
   * @param position?
   */
  public addTextElement(text: string, position?: string) {
    position = position ? position : 'absolute';
    const ele = new ElementObject(this, this.element, `<div>${text}</div>`);
    this.childElements[ele.id] = ele;
    ele.style.position = position;
    return ele;
  }

  public removeElement(id: string): void;
  public removeElement(ele: ElementObject): void;
  public removeElement(ele: string | ElementObject) {
    if (ele instanceof ElementObject) {
      this.element.removeChild(ele.element);
      delete this.childElements[ele.id];
    } else {
      const id = ele;
      this.element.removeChild(this.childElements[id].element);
      delete this.childElements[id];
    }
  }
  // public addText(): TextObject {
  //   const text = new TextObject(this.element);
  //   return text;
  // }
}
