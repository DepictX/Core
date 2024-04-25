import { Element } from '../element';
import { createEffect } from '../hooks';
import { IEffectElement, IElement } from '../interface';
import type { Module } from '../interface/module';
import { Node } from '../node';
import { isInternalLayout } from '../utils/isInternalLayout';
import { omit } from '../utils/omit';

export class Engine {
  private modules: Record<string, Module> = {};

  private elementsToNodes = new Map<Element, Node>();

  private effectElementsToNodes = new Map<IEffectElement, Set<Node>>();

  rootNode?: Node;

  private building = false;

  private container?: HTMLElement;

  use(module: Module) {
    this.modules[module.type] = module;
  }

  render(root: IElement, container: HTMLElement) {
    this.container = container;
    this.install();

    this.createNodeTree(root);

    const constrain = {
      height: container.clientHeight,
      width: container.clientWidth,
    };

    if (!this.rootNode) throw new Error('Create Nodes Failed!');

    // 通过 reconciler 优先 measure 视口节点，生成 RenderObject
    // @ts-expect-error: test
    this.modules.Layout.measure(this.rootNode, constrain);

    // 对视口内的 RenderObject 进行绘制
    // @ts-expect-error: test
    this.modules.View.draw(container, this.rootNode);

    // window.addEventListener('__UPDATE_VIEW__', () => {
    //   // @ts-expect-error
    //   this.modules.View.draw(container, fiber);
    // });
  }

  destroy() { }

  private install() {
    // check modules

    for (const module of Object.values(this.modules)) {
      module.install(this);
    }
  }

  private createNodeTree(root: Element) {
    this.build(root);
  }

  private build(el: IElement, parentNode: Node | null = null, effectElem?: IEffectElement) {
    let children = el.type(el.props);
    if (children && !Array.isArray(children)) children = [children];

    // const children = el.props?.children;

    let node = parentNode;
    // 只有 Internal Layout 才创建 Node
    if (isInternalLayout(el.type)) {
      node = new Node(el.type);

      if (!this.rootNode) this.rootNode = node;

      const props = omit(el.props || {}, new Set(['children', 'style']));

      node.updateProps(Object.keys(props).reduce((o, k) => {
        if (props[k] instanceof Function) {
          createEffect(() => {
            o[k] = props[k]();
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
  }

  private rebuild() {
    if (this.building) return;
    this.building = true;
    Promise.resolve().then(() => {
      const constrain = {
        height: this.container!.clientHeight,
        width: this.container!.clientWidth,
      };
      // @ts-expect-error: test
      this.modules.Layout.measure(this.rootNode, constrain);

      // @ts-expect-error: test
      this.modules.View.draw(this.container, this.rootNode);
      this.building = false;
    });
  }
}
