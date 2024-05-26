import { IDefaultProps } from '../interfaces';

export interface IViewProps extends IDefaultProps {
}

export function View(props: IViewProps) {
  return props.children;
}
