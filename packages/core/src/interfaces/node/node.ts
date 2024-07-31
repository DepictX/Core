import { IProperties } from '../properties/properties';

export interface INode {
  readonly type: string;

  props?: IProperties;

  children?: INode[];
}
