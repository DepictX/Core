import { Node } from '@depict-x/core';
import { IFlexibleProps } from '@depict-x/measurement';

export interface IFlexProps extends IFlexibleProps {}

export interface IFlexStyle {}

export class FlexNode extends Node<IFlexProps, IFlexStyle> {
  static type = 'Flex';
}
