import { InternalLayout } from './layout';

export interface IDefaultProps {
  children: IElement | IElement[];
}

export type IElementChildren = null | IElement | IEffectElement | (IElement | IEffectElement)[];

export type IElementType<T = any> = ((props?: T) => IElementChildren) | InternalLayout;

export type IEffectElement = () => IElement | IElement[];

export interface IElementProps {
  children?: (IElement | IEffectElement)[];
  [key: string]: any;
}

export interface IElement {
  type: IElementType;

  key?: string;

  ref?: any;

  props?: IElementProps;
}
