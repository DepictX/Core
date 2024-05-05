import { inject, injectable } from 'inversify';

import { Injector, InjectorId } from '../injector';
import { LifecycleService, LifecycleStage } from '../lifecycle';

import { Extension, IExtensionCtor, IOptions } from './extension';

const LifecycleCaller = {
  [LifecycleStage.onInit]: 'onInit',
  [LifecycleStage.onStart]: 'onStart',
  [LifecycleStage.onReady]: 'onReady',
  [LifecycleStage.onDestroy]: 'onDestroy',
} as const;

export interface IExtensionsRegistrar {
  register(Extension: IExtensionCtor, options?: IOptions): void;
  register(Extensions: [IExtensionCtor, IOptions?][]): void;
  register(Extension: IExtensionCtor | ([IExtensionCtor, IOptions?][]), options?: IOptions): void;
}

@injectable()
export class ExtensionsRegistrar implements IExtensionsRegistrar {
  private _extensionIns: Extension[] = [];
  private _Extensions = new Map<IExtensionCtor, IOptions | undefined>();

  constructor(
    @inject(InjectorId) private _injector: Injector,
    @inject(LifecycleService) private _lifecycle: LifecycleService,
  ) {
    this._lifecycle.stage$.subscribe(stage => {
      if (stage === LifecycleStage.onInit) {
        return;
      }
      this._extensionIns.forEach(extension => extension[LifecycleCaller[stage]]?.());
    });
  }

  register(Extension: IExtensionCtor | ([IExtensionCtor, IOptions?][]), options?: IOptions) {
    let Extensions = Extension as [IExtensionCtor, IOptions?][];

    if (!Array.isArray(Extension)) {
      Extensions = [[Extension, options]];
    }

    Extensions.forEach(([E, o]) => {
      if (this._Extensions.has(E)) {
        throw new Error(`Extension ${E} is already registered!`);
      }

      this._Extensions.set(E, o);

      this._injector.bind(E).toSelf();

      const extension = this._injector.get<Extension>(E);

      const index = this._extensionIns.findIndex(m => (m.constructor as IExtensionCtor).priority > E.priority);

      if (index === -1) {
        this._extensionIns.push(extension);
      } else {
        this._extensionIns.splice(index, 0, extension);
      }

      for (let stage = LifecycleStage.onStart; stage <= this._lifecycle.getStage(); stage++) {
        if (stage === LifecycleStage.onInit) {
          return extension[LifecycleCaller[stage]]?.(o);
        }
        extension[LifecycleCaller[stage]]?.();
      }
    });
  }
}
