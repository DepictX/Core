import { IElementType, LAYOUT_TYPE, InternalLayout } from '../interface';

export function isInternalLayout(fn: IElementType): fn is InternalLayout {
  return !!(fn as InternalLayout)[LAYOUT_TYPE];
}
