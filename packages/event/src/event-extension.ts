import {
  Extension, type ILayout, LayoutExtensionId, type INode,
  IEvent,
  EventKeys,
  toDisposable,
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
    this.with(toDisposable(this.delegateNativeEventListener()));
  }

  bind(node: INode) {
    const listeners = PROPS_LISTENERS
      .map(key => node.props?.[key])
      .filter(Boolean)
      .forEach((listener) => {
      });
  }

  private delegateNativeEventListener() {
    const keys = Object.keys(EventKeys) as (keyof HTMLElementEventMap)[];
    const { canvas } = this.options;

    keys.forEach((key) => {
      const handler = this[toHandler(key)] as(ev: HTMLElementEventMap[typeof key]) => any;
      canvas.addEventListener(key, handler);
    });

    return () => {
      keys.forEach((key) => {
        const handler = this[toHandler(key)] as(ev: HTMLElementEventMap[typeof key]) => any;
        canvas.removeEventListener(key, handler);
      });
    }
  }

  private handleMousedown(e: MouseEvent) {

  }

  private handleMouseup() {}

  private handleClick() {}
}
