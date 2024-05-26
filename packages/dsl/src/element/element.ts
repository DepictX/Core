import { IElement, IElementProps, IElementType } from '../interfaces';

export class Element implements IElement {
  static create(type: IElementType, key?: string, ref?: any, props?: IElementProps) {
    return new Element(type, key, ref, props);
  }

  constructor(public type: IElementType, public key?: string, public ref?: any, public props?: IElementProps) {}
}
