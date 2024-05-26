import {
  Extension, Injector, InjectorId, type IReconciler, Node, ReconcilerExtensionId,
  TextNode, 
} from '@depict-x/core';
import { inject, injectable } from 'inversify';

import { ElementToPlugin } from '../configs';
import { createEffect } from '../hooks';
import { IEffectElement, IElement } from '../interfaces';
import { omit } from '../utils/omit';

interface IDslOptions {
  canvas: HTMLCanvasElement;
}

@injectable()
export class DslExtension extends Extension<IDslOptions> {
  @inject(ReconcilerExtensionId) private _reconciler: IReconciler;

  @inject(InjectorId) private _injector: Injector;

  private elementsToNodes = new Map<IElement, Node>();

  private effectElementsToNodes = new Map<IEffectElement, Set<Node>>();

  private building = false;

  private rootNode: Node;

  render(root: IElement) {
    this.build(root);

    if (!this.rootNode) throw new Error('');

    this._reconciler.setRoot(this.rootNode);
    this._reconciler.start();
  }

  private build(el: IElement, parentNode: Node | null = null, effectElem?: IEffectElement) {
    let children = el.type(el.props);
    if (children && !Array.isArray(children)) children = [children];

    let node = parentNode;

    const PluginCtor = ElementToPlugin.get(el.type);

    if (PluginCtor) {
      const plugin = this._injector.get(PluginCtor);
  
      if (!plugin || !plugin.addNode) throw new Error('Plugin not register!');
  
      node = plugin.addNode();
  
      if (!this.rootNode) this.rootNode = node;
  
      const props = omit(el.props || {}, new Set(['children', 'style']));
  
      node.updateProps(Object.keys(props).reduce((o, k) => {
        if (props[k] instanceof Function) {
          createEffect(() => {
            o[k] = props[k]();

            if (node instanceof TextNode && k === 'content') {
              node.content = o[k];
            }
            
            this.rebuild();
          });
        } else o[k] = props[k];
        return o;
      }, {} as { [key: string]: any }));
  
      const style = el.props?.style;
      style && node.updateStyle(Object.keys(style).reduce((o, k) => {
        if (style[k] instanceof Function) {
          createEffect(() => {
            o[k] = style[k]();
            this.rebuild();
          });
        } else o[k] = style[k];
        return o;
      }, {} as { [key: string]: any }));

      if (node instanceof TextNode) {
        node.content = node.props.content || '';
      }
  
      this.elementsToNodes.set(el, node);
  
      if (effectElem) {
        if (!this.effectElementsToNodes.has(effectElem)) this.effectElementsToNodes.set(effectElem, new Set());
        this.effectElementsToNodes.get(effectElem)?.add(node);
      }
  
      parentNode?.append(node);
    }

    children?.forEach(child => {
      if (child instanceof Function) {
        createEffect(() => {
          let elements = child();
          if (!Array.isArray(elements)) elements = [elements];

          const olds = this.effectElementsToNodes.get(child);
          olds?.forEach(old => old.remove());
          olds?.clear();

          elements.forEach(element => {
            // 重新构建 node
            this.build(element, node, child);
          });
          this.rebuild();
        });
      } else {
        this.build(child, node);
      }
    });

    return node;
  }

  private rebuild() {
    if (this.building) return;
    this.building = true;
    Promise.resolve().then(() => {
      this._reconciler.start();
      this.building = false;
    });
  }
}
