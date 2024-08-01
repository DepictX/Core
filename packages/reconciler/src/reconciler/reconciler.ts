import {
  Extension,
  type ILayout,
  IReconciler,
  type IRenderer,
  LayoutExtensionId,
  Node,
  RenderExtensionId,
} from '@depict-x/core';
import { inject, injectable } from 'inversify';

@injectable()
export class Reconciler extends Extension implements IReconciler {
  @inject(RenderExtensionId) private _renderer: IRenderer;

  @inject(LayoutExtensionId) private _layout: ILayout;

  root: Node;

  setRoot(node: Node) {
    this.root = node;
  }

  getRoot() {
    return this.root;
  }

  start() {
    this._layout.measure(this.root);
    this._renderer.render(this.root);
  }
}
