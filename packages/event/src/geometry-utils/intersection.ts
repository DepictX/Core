import { IRectangle } from '@depict-x/core';

export function intersect(rect: IRectangle, range: IRectangle) {
  return !(range.x > rect.x + rect.width || range.x + range.width < rect.x ||
    range.y > rect.y + rect.height || range.y + range.height < rect.y);
}