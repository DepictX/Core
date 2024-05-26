import {
  IMeasurement, Injector, InjectorId, Plugin,
} from '@depict-x/core';
import { Relative } from '@depict-x/measurement';
import { inject, injectable } from 'inversify';

import { ViewNode } from './view-node';

@injectable()
export class ViewPlugin extends Plugin {
  @inject(InjectorId) private _injector: Injector;

  type = ViewNode.type;

  addNode() {
    return new ViewNode();
  }

  addMeasurement(): IMeasurement<ViewNode> {
    return new Relative();
  }
}
