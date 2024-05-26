import {
  IFontStyle,
  IMeasurement, Injector, InjectorId, Plugin,
} from '@depict-x/core';
import { ITextProps, Inline } from '@depict-x/measurement';
import { inject, injectable } from 'inversify';

import { InlineNode } from './inline-node';

export interface ITextNodeProps extends ITextProps {}
export interface ITextNodeStyle extends IFontStyle {}

@injectable()
export class InlinePlugin extends Plugin {
  @inject(InjectorId) private _injector: Injector;

  type = InlineNode.type;

  addNode() {
    return new InlineNode();
  }

  addMeasurement(): IMeasurement<InlineNode> {
    return new Inline();
  }
}
