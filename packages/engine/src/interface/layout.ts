import { IElementChildren } from './element';
import { INode } from './node';

export const BLOCK = Symbol('DEPICT_LAYOUT_TYPE_BLOCK');
export const INLINE = Symbol('DEPICT_LAYOUT_TYPE_INLINE');
export const LAYOUT_TYPE = Symbol('DEPICT_LAYOUT_TYPE');
export const MEASUREMENTS = Symbol('DEPICT_MEASUREMENTS');

export interface IConstrains {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  fitContent?: number;
}

export interface IPrepareContext {
  containerConstrains: {
    width: number;
    height: number;
  };
  getNodeConstrains(node: INode): IConstrains;
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
   * when skipChildren is true, mean children nodes already measure by current node,
   * which will skip call children's measure function.
   */
  skipChildren?: boolean;
  /**
   * A temp variable for measure function to store some message
   */
  storage: {
    [key: string]: any;
  };
}

export type InternalLayout<T = any> = ((props: T) => IElementChildren) & {
  [LAYOUT_TYPE]: typeof BLOCK | typeof INLINE;
  [MEASUREMENTS]: {
    /**
     * 1. pre-calculate node's min/max width and height；
     *    undefined mean auto
     * 2. init metrics
     * 3. assert structures
     */
    prepare(node: INode, ctx: IPrepareContext): IConstrains;
    /**
     * pre-order traversal, usually, measure node's width and left
     */
    measure(node: INode, ctx: IMeasureContext): void;
    /**
     * post-order traversal, usually, measure node's height and top
     */
    postMeasure?(node: INode, ctx: IMeasureContext): void;
  };
};
