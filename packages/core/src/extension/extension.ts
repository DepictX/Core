import { injectable, interfaces, preDestroy } from 'inversify';

export interface IOptions {
  [key: string]: any;
}

export type IExtensionCtor = interfaces.Newable<Extension> & { priority: number };

@injectable()
export abstract class Extension {
  static priority = 0;

  onInit?(options?: IOptions): void;

  onStart?(): void;
  
  onReady?(): void;
  
  @preDestroy()
  onDestroy?() {}
}
