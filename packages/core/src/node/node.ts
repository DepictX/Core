import { Nullable } from '../types';

import { IFontStyle, IStyle } from './style';

export type IDefaultProps = Nullable<Record<string, any>>;

export type IDefaultStyle = Nullable<Partial<IStyle>>;

export type IDefaultTextStyle = Nullable<Partial<IFontStyle>>;

export abstract class Node<
  P extends IDefaultProps = any,
  S extends IDefaultStyle = any,
> {
  static type: string;

  props: P;

  style: S;

  parent: Nullable<Node> = null;

  firstChild: Nullable<Node> = null;

  lastChild: Nullable<Node> = null;

  prevSibling: Nullable<Node> = null;

  nextSibling: Nullable<Node> = null;

  layoutDirty = true;

  viewDirty = true;

  get children() {
    const children: Node[] = [];
    this.each(child => {
      children.push(child);
    });
    return children;
  }

  setParent(parent: Node) {
    if (this.parent === parent) return;

    this.parent = parent;
    this.markDirty();
  }

  append(child: Node) {
    // if (!this.children) this.children = [];
    // this.children.push(child);
    if (this.lastChild) {
      this.lastChild.nextSibling = child;
      child.prevSibling = this.lastChild;
      this.lastChild = child;
    } else {
      this.firstChild = child;
      this.lastChild = child;
    }

    this.markDirty();

    child.setParent(this);
  }

  index() {
    let index = -1;
    this.parent?.each((child, i) => {
      if (child !== this) return;
      index = i;
      return true;
    });
    return index;
  }

  remove() {
    if (!this.parent) return;
    if (!this.prevSibling) {
      this.parent.firstChild = this.nextSibling;
    } else {
      this.prevSibling.nextSibling = this.nextSibling;
    }

    if (!this.nextSibling) {
      this.parent.lastChild = this.prevSibling;
    } else {
      this.nextSibling.prevSibling = this.prevSibling;
    }
  }

  each(fn: (child: Node, index: number) => boolean | void) {
    for (
      let child = this.firstChild, index = 0;
      child;
      child = child.nextSibling, index++
    ) {
      if (fn(child, index)) break;
    }
  }

  descendants(config: {
    /**
     * if true will traverse itself
     */
    self?: boolean;
    /**
     * pre-order traverse, return true will stop traverse children
     */
    pre?: (node: Node, storage: { [key: string]: any }) => boolean | void;
    /**
     * post-order traverse, return true will stop traverse children
     */
    post?: (node: Node, storage: { [key: string]: any }) => boolean | void;
  }) {
    const { self, pre, post } = config;
    if (!pre && !post) return;

    const storage = {};

    if (self && pre?.(this, storage)) return;

    this.children.forEach(child => {
      child.descendants({
        pre,
        post,
        self: true,
      });
    });

    if (self && post?.(this, storage)) return;
  }

  markDirty() {
    this.viewDirty = true;
    this.layoutDirty = true;
  }

  updateProps(props: P) {
    if (this.props === props) return;
    this.props = props;
    this.markDirty();
  }

  updateStyle(style: S) {
    if (this.style === style) return;
    this.style = style;
    this.markDirty();
  }
}

export class TextNode<
  P extends IDefaultProps = any,
  S extends IDefaultTextStyle = any,
> extends Node<P, S> {
  content: string = '';

  get children() {
    return [];
  }

  append(_child: Node) {
    throw new Error('Text is leaf node!');
  }
}
