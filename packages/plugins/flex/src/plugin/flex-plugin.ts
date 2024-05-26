import {
  IMeasurement, Injector, InjectorId, Plugin, 
} from '@depict-x/core';
import { Flexible } from '@depict-x/measurement';
import { inject, injectable } from 'inversify';

import { FlexNode, IFlexProps } from './flex-node';

@injectable()
export class FlexPlugin extends Plugin {
  @inject(InjectorId) private _injector: Injector;

  type = FlexNode.type;

  addNode() {
    return new FlexNode();
  }

  addMeasurement(): IMeasurement<FlexNode> {
    return new Flexible<IFlexProps>();
  }
}
