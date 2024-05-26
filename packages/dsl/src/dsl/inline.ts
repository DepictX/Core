import { IDefaultProps } from '../interfaces';

export interface IInlineProps extends IDefaultProps {
}

export function Inline(props: IInlineProps) {
  return props.children;
}
