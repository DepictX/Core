import { interfaces } from 'inversify';

import { ExtensionsRegistrar, Extension, IExtensionCtor } from '../extension';
import { Injector, InjectorId } from '../injector';
import { LifecycleService, LifecycleStage } from '../lifecycle';

export class DepictX {
  private _injector = new Injector({ defaultScope: 'Singleton' });

  private _registrar: ExtensionsRegistrar;

  private _lifecycle: LifecycleService;

  constructor() {
    this._initDependencies();

    this._registrar = this._injector.get(ExtensionsRegistrar);
    this._lifecycle = this._injector.get(LifecycleService);
  }

  private _initDependencies() {
    this._injector.bind(InjectorId).toConstantValue(this._injector);
    this._injector.bind(ExtensionsRegistrar).toSelf();
    this._injector.bind(LifecycleService).toSelf();
  }

  register<T>(Extension: IExtensionCtor<T>, options?: T): void;
  register<T>(
    identifier: interfaces.ServiceIdentifier<Extension<T>>,
    Extension: IExtensionCtor<T>,
    options?: T,
  ): void;
  register(...args: Parameters<ExtensionsRegistrar['register']>) {
    this._registrar.register(...args);
  }

  render() {
    // start
    this._lifecycle.next(LifecycleStage.onStart);

    // ready
    Promise.resolve().then(() => this._lifecycle.next(LifecycleStage.onReady));
  }

  destroy() {
    this._injector.unbindAll();

    // destroy
    this._lifecycle.next(LifecycleStage.onDestroy);
  }
}
