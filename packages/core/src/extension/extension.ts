import { injectable, interfaces, preDestroy } from 'inversify';
import { Disposable } from '../disposable';

export interface IOptions {
  [key: string]: any;
}

export type IExtensionCtor<T = undefined> = interfaces.Newable<Extension<T>> & { priority: number };

@injectable()
export abstract class Extension<T = unknown> extends Disposable {
  static priority = 0;

  protected _options: T;

  onInit?(options: T) {
    this._options = options;
  };

  onStart?(): void;

  onReady?(): void;

  @preDestroy()
  onDestroy?() {}
}
