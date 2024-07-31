import { Nullable } from '../../types/nullable';

export type IDefaultProperties = Nullable<Record<string, any>>;

export interface IEventProperties {
  onMousedown?(): void;
  onMouseup?(): void;
  onClick?(): void;
}

export type IProperties = IEventProperties & IDefaultProperties;
