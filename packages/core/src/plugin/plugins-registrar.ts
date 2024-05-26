import { inject, injectable } from 'inversify';

import { createIdentifier, Injector, InjectorId } from '../injector';
import { Node } from '../node';

import { IPluginCtor, Plugin } from './plugin';

@injectable()
export class PluginManager {
  private _plugins = new Map<string, Plugin>();

  // eslint-disable-next-line @typescript-eslint/ban-types
  private _ctorToPlugin = new Map<Function, Plugin>();

  constructor(
    @inject(InjectorId) private _injector: Injector,
  ) {}

  getPlugins(): readonly Plugin[] {
    return Array.from(this._plugins.values());
  }

  register(Plugin: IPluginCtor) {
    this._injector.bind(Plugin).toSelf();
    const instance = this._injector.get(Plugin);
    
    // TODO: a kind of node maybe register many plugins
    const addNode = instance.addNode;
    if (addNode) {
      instance.addNode = () => {
        const node = addNode();
        this._ctorToPlugin.set(node.constructor, instance);
        return addNode();
      };
    }

    this._plugins.set(instance.type, instance);
  }

  getPluginForNode(node: Node) {
    return this._ctorToPlugin.get(node.constructor)!;
  }

  getPluginForType(type: string) {
    return this._plugins.get(type);
  }
}

export const PluginManagerId = createIdentifier<PluginManager>('service.plugin-manager');
