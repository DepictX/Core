import { injectable, interfaces } from 'inversify';

import { IMeasurement } from '../interfaces';
import { Node } from '../node';

export type IPluginCtor = interfaces.Newable<Plugin>;

@injectable()
export abstract class Plugin {
  type: string;

  addNode?(): Node;

  addMeasurement?(): IMeasurement<Node>;

  addEvents?(): any;
}
