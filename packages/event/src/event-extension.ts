import {
  Extension, type ILayout, IRenderer, LayoutExtensionId, Node,
  IEvent,
  EventKeys,
} from '@depict-x/core';
import { INode } from '@depict-x/core/src/interfaces/node/node';
import { inject, injectable } from 'inversify';
import { toHandler } from './utils';

export interface IEventOptions {
  canvas: HTMLCanvasElement;
}

@injectable()
export class Event extends Extension<IEventOptions> implements IEvent {

  private listeners: any;

  @inject(LayoutExtensionId) private _layout: ILayout;

  constructor(private options: IEventOptions) {
    super();
    this.delegateNativeEventListener('add');
  }

  bind(node: INode) {
    // node
  }

  onDestroy() {
    this.delegateNativeEventListener('remove');
  }

  private delegateNativeEventListener(type: 'add' | 'remove') {
    Object.keys(EventKeys).forEach((key) => {
      if (type === 'add') {
        this.options.canvas.addEventListener(key, this[toHandler(key)]);
      } else {
        this.options.canvas.removeEventListener(key, this[toHandler(key)]);
      }
    });
  }

  private handleMousedown() {}

  private handleMouseup() {}

  private handleClick() {}
}
