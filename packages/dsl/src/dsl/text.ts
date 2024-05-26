import { ITextNodeProps, ITextNodeStyle } from '@depict-plugins/text';

export interface ITextElementProps extends ITextNodeProps {
  style?: ITextNodeStyle;
}

export function Text(_props: ITextElementProps) {
  return null;
}
