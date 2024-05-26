import { interfaces } from 'inversify';

import { ExtensionsRegistrar, Extension, IExtensionCtor } from '../extension';
import { Injector, InjectorId } from '../injector';
import { LifecycleService, LifecycleStage } from '../lifecycle';
import { IPluginCtor, PluginManagerId, PluginManager } from '../plugin';

export class DepictX {
  private _injector = new Injector({ defaultScope: 'Singleton' });

  private _pluginRegistrar: PluginManager;
  
  private _extensionRegistrar: ExtensionsRegistrar;

  private _lifecycle: LifecycleService;

  constructor() {
    this._initDependencies();

    this._pluginRegistrar = this._injector.get(PluginManagerId);
    this._extensionRegistrar = this._injector.get(ExtensionsRegistrar);
    this._lifecycle = this._injector.get(LifecycleService);
  }

  private _initDependencies() {
    this._injector.bind(InjectorId).toConstantValue(this._injector);
    this._injector.bind(PluginManagerId).to(PluginManager);
    this._injector.bind(ExtensionsRegistrar).toSelf();
    this._injector.bind(LifecycleService).toSelf();
  }

  registerExtension<T>(Extension: IExtensionCtor<T>, options?: T): void;
  registerExtension<T>(
    identifier: interfaces.ServiceIdentifier<Extension>,
    Extension: IExtensionCtor<T>,
    options?: T,
  ): void;
  registerExtension(...args: Parameters<ExtensionsRegistrar['register']>) {
    this._extensionRegistrar.register(...args);
  }

  registerPlugin(PluginCtor: IPluginCtor) {
    this._pluginRegistrar.register(PluginCtor);
  }

  getExtension<T>(identifier: interfaces.ServiceIdentifier<T>) {
    return this._injector.get(identifier);
  }

  start() {
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
