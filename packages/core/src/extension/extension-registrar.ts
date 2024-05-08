import { inject, injectable, interfaces } from 'inversify';

import { Disposable } from '../disposable';
import { Injector, InjectorId } from '../injector';
import { LifecycleService, LifecycleStage } from '../lifecycle';

import { Extension, IExtensionCtor } from './extension';
import { isExtensionCtor } from './utils';

const LifecycleCaller = {
  [LifecycleStage.onInit]: 'onInit',
  [LifecycleStage.onStart]: 'onStart',
  [LifecycleStage.onReady]: 'onReady',
  [LifecycleStage.onDestroy]: 'onDestroy',
} as const;

@injectable()
export class ExtensionsRegistrar extends Disposable {
  private _extensionIns: Extension<any>[] = [];
  private _Extensions = new Map<IExtensionCtor<any>, any>();

  constructor(
    @inject(InjectorId) private _injector: Injector,
    @inject(LifecycleService) private _lifecycle: LifecycleService,
  ) {
    super();
    this.with(this._lifecycle.stage$.subscribe(stage => {
      if (stage === LifecycleStage.onInit) {
        return;
      }
      this._extensionIns.forEach(extension => extension[LifecycleCaller[stage]]?.());
    }));
  }

  register<T>(Extension: IExtensionCtor<T>, options?: T): void;
  register<T>(
    identifier: interfaces.ServiceIdentifier<Extension<T>>,
    Extension: IExtensionCtor<T>,
    options?: T,
  ): void;
  register<T>(
    identifier: interfaces.ServiceIdentifier<Extension<T>> | IExtensionCtor<T>,
    Extension?: IExtensionCtor<T> | T,
    options?: T,
  ) {
    let id: interfaces.ServiceIdentifier<Extension<T>> | undefined;
    let E: IExtensionCtor<T> | undefined;
    if (isExtensionCtor(identifier)) {
      E = identifier;
    } else if (isExtensionCtor<T>(Extension)) {
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

    const extension = this._injector.get<Extension<T>>(id || E);

    const index = this._extensionIns.findIndex(m => (m.constructor as IExtensionCtor).priority > E.priority);

    if (index === -1) {
      this._extensionIns.push(extension);
    } else {
      this._extensionIns.splice(index, 0, extension);
    }

    for (let stage = LifecycleStage.onInit; stage <= this._lifecycle.getStage(); stage++) {
      if (stage === LifecycleStage.onInit) {
        extension[LifecycleCaller[stage]]?.(options as T);
      } else {
        extension[LifecycleCaller[stage]]?.();
      }
    }
  }
}
