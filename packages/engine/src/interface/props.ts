import { Node } from '../node';

import { IStyle } from './style';

export interface DefaultProps {
  id?: string;
  style?: IStyle;

  selectable?: boolean;

  // 自定义绘制接口
  draw?(ctx: CanvasRenderingContext2D, fiber: Node): void;
}
