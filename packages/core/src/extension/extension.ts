import { injectable, interfaces, preDestroy } from 'inversify';

export interface IOptions {
  [key: string]: any;
}

export type IExtensionCtor<T = undefined> = interfaces.Newable<Extension<T>> & { priority: number };

@injectable()
export abstract class Extension<T = unknown> {
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
