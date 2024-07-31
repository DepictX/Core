import { Extension } from "../../extension";
import { INode } from "../node/node";

export enum EventKeys {
  Keydown = 'keydown',
  Keyup = 'keyup',

  Mousedown = 'mousedown',
  Mouseup = 'mouseup',
  Mousemove = 'mousemove',

  Click = 'click',
}

export interface IEvent extends Extension {
  bind(node: INode): void;
}
