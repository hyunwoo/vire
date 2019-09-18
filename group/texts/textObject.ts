import { v4 as uuid } from 'uuid';
import ElementGroup from './textGroup';

export default class ElementObject {
  public readonly id: string;
  private readonly _element: HTMLElement;
  private readonly group: ElementGroup;

  public constructor(group: ElementGroup, parent: HTMLElement, template?: string) {
    this.group = group;
    template = template ? template : '<div></div>';
    const div = document.createElement('div');
    div.innerHTML = template.trim();
    if (div.firstElementChild === null) {
      throw new Error('failed create child node');
    }
    this._element = div.firstElementChild as HTMLElement;
    parent.appendChild(this._element);
    this.id = uuid();
  }

  public remove() {
    this.group.removeElement(this);
  }
  public set innerText(text: string) {
    this._element.innerText = text;
  }
  public set innerHtml(html: string) {
    this._element.innerHTML = html;
  }
  public set style(style: Partial<CSSStyleDeclaration>) {
    Object.assign(this._element.style, style);
  }
  public get style() {
    return this._element.style;
  }

  public get class() {
    return this._element.className;
  }

  public set class(classes: string) {
    this._element.className = classes;
  }
  public addClass(classes: string) {
    this._element.className = `${this._element.className} ${classes}`;
  }
  public get element() {
    return this._element;
  }

}

