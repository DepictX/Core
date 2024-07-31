export interface INode {
  readonly type: string;

  children?: INode[];
}