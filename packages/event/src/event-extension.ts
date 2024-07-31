import {
  Extension, type ILayout, LayoutExtensionId, type INode,
  IEvent,
  EventKeys,
} from '@depict-x/core';
import { inject, injectable } from 'inversify';

import { toHandler, toOn } from './utils';

export interface IEventOptions {
  canvas: HTMLCanvasElement;
}

const PROPS_LISTENERS = Object.keys(EventKeys).map(toOn);

@injectable()
export class Event extends Extension<IEventOptions> implements IEvent {

  private listeners: any;

  @inject(LayoutExtensionId) private _layout: ILayout;

  constructor(private options: IEventOptions) {
    super();
    this.delegateNativeEventListener('add');
  }

  bind(node: INode) {
    const listeners = PROPS_LISTENERS
      .map(key => node.props?.[key])
      .filter(Boolean)
      .forEach((listener) => {
      });
  }

  onDestroy() {
    this.delegateNativeEventListener('remove');
  }

  private delegateNativeEventListener(type: 'add' | 'remove') {
    const keys = Object.keys(EventKeys) as (keyof HTMLElementEventMap)[];
    const { canvas } = this.options;
    keys.forEach(key => {
      const handler = this[toHandler(key)] as (ev: HTMLElementEventMap[typeof key]) => any;
      if (type === 'add') {
        canvas.addEventListener(key, handler);
      } else {
        canvas.removeEventListener(key, handler);
      }
    });
  }

  private handleMousedown(e: MouseEvent) {

  }

  private handleMouseup() {}

  private handleClick() {}
}
