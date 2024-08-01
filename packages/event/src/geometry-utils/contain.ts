import { IPoint, IRectangle, IRelativePoint, IRelativeRectangle } from '@depict-x/core';

export function contain(point: IRelativePoint, rect: IRelativeRectangle) {
  return point.left >= rect.left && point.left < rect.left + rect.width &&
    point.top >= rect.top && point.top < rect.top + rect.height;
}