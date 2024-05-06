import { inject, injectable, interfaces } from 'inversify';

import { Injector, InjectorId } from '../injector';
import { LifecycleService, LifecycleStage } from '../lifecycle';

import { Extension, IExtensionCtor, IOptions } from './extension';
import { isExtensionCtor } from './utils';

const LifecycleCaller = {
  [LifecycleStage.onInit]: 'onInit',
  [LifecycleStage.onStart]: 'onStart',
  [LifecycleStage.onReady]: 'onReady',
  [LifecycleStage.onDestroy]: 'onDestroy',
} as const;

export interface IExtensionsRegistrar {
  register(Extension: IExtensionCtor, options?: IOptions): void;
  register(identifier: interfaces.ServiceIdentifier<Extension>, Extension: IExtensionCtor, options?: IOptions): void;
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

  register(
    identifier: interfaces.ServiceIdentifier<Extension> | IExtensionCtor,
    Extension?: IExtensionCtor | IOptions,
    options?: IOptions,
  ) {
    let id: interfaces.ServiceIdentifier<Extension> | undefined;
    let E: IExtensionCtor | undefined;
    if (isExtensionCtor(identifier)) {
      E = identifier;
    } else if (isExtensionCtor(Extension)) {
      id = identifier;
      E = Extension;
    }

    if (!E || this._Extensions.has(E)) {
      throw new Error(`Extension ${E} is already registered!`);
    }

    this._Extensions.set(E, options);

    if (id) {
      this._injector.bind(id).to(E);
    } else {
      this._injector.bind(E).toSelf();
    }

    const extension = this._injector.get<Extension>(id || E);

    const index = this._extensionIns.findIndex(m => (m.constructor as IExtensionCtor).priority > E.priority);

    if (index === -1) {
      this._extensionIns.push(extension);
    } else {
      this._extensionIns.splice(index, 0, extension);
    }

    for (let stage = LifecycleStage.onInit; stage <= this._lifecycle.getStage(); stage++) {
      if (stage === LifecycleStage.onInit) {
        extension[LifecycleCaller[stage]]?.(options);
      } else {
        extension[LifecycleCaller[stage]]?.();
      }
    }
  }
}
