
import { IFlexProps, IFlexStyle } from '@depict-plugins/flex';

import { IDefaultProps } from '../interfaces';

export interface IFlexComponentProps extends IDefaultProps, IFlexProps {
  style?: IFlexStyle;
}

export function Flex(props: IFlexComponentProps) {
  return props.children;
}
