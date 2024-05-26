import {
  IDefaultProps, IDefaultStyle, Node, TextNode, 
} from '../../node';
import { ILayout } from '../layout';

export interface IConstrains {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  fitContent?: number;
}

export interface IBaseMetrics {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface IElementMetrics<
  P extends IDefaultProps = IDefaultProps,
  S extends IDefaultStyle = IDefaultStyle,
> extends IBaseMetrics {
  style: S;
  props: P;
  inheritStyle?: S;
}

export interface ITextMetrics<
  P extends IDefaultProps = IDefaultProps,
  S extends IDefaultStyle = IDefaultStyle,
> {
  content: string;
  rects: {
    range: [number, number];
    metrics: IBaseMetrics;
  }[];
  baseline: number;
  style: S;
  props: P;
  inheritStyle?: S;
}

export type IMetrics = IElementMetrics | ITextMetrics;

export interface IBaseContext {
  getMetrics: ILayout['getMetrics'];
  
  getBaseMetrics: ILayout['getBaseMetrics'];

  setMetrics<T extends Node>(node: T, metrics: T extends TextNode ? ITextMetrics : IElementMetrics): void;

  getLayoutType(node: Node): LayoutType;

  containerConstrains: {
    width: number;
    height: number;
  };
}

export interface IPrepareContext extends IBaseContext {
  getNodeConstrains(node: Node): IConstrains;
}

export interface IMeasureContext extends IPrepareContext {
  /**
   * parent node given available width and height
   * undefined mean auto
   */
  availableSpace?: {
    width?: number;
    height?: number;
  };
  /**
   * A temp variable for measure function to store some message
   */
  storage: {
    [key: string]: any;
  };
}

export enum LayoutType {
  /**
   * Block layout:
   * Will fill the whole line in default.
   * Can contain any kind of layout.
   */
  Element = 'Element',
  Text = 'TEXT',
}

export interface IMeasurement<N extends Node> {
  layoutType: LayoutType;
  /**
   * If true, mean this measurement will handle its children layout measure.
   */
  willHandleChildren?: boolean;
  /**
   * 1. pre-calculate node's min/max width and height；
   *    undefined mean auto
   * 2. init metrics
   * 3. assert structures
   */
  prepare(node: N, ctx: IPrepareContext): IConstrains;
  /**
   * pre-order traversal, usually, measure node's width and left
   */
  measure(node: N, ctx: IMeasureContext): void;
  /**
   * post-order traversal, usually, measure node's height and top
   */
  postMeasure?(node: N, ctx: IMeasureContext): void;
};
