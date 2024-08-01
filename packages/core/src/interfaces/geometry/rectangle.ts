import { IPoint, IRelativePoint } from './point';

export interface IDimensions {
  height: number;
  width: number;
}

export interface IRectangle extends IPoint, IDimensions {
}

export interface IRelativeRectangle extends IRelativePoint, IDimensions {
}