import {
  IFontStyle,
  IMeasurement, Injector, InjectorId, Plugin,
  TextNode, 
} from '@depict-x/core';
import { ITextProps, Text } from '@depict-x/measurement';
import { inject, injectable } from 'inversify';

export interface ITextNodeProps extends ITextProps {}
export interface ITextNodeStyle extends IFontStyle {}

@injectable()
export class TextPlugin extends Plugin {
  @inject(InjectorId) private _injector: Injector;

  type = 'Text';

  addNode() {
    return new TextNode<ITextNodeProps, ITextNodeStyle>();
  }

  addMeasurement(): IMeasurement<TextNode<ITextNodeProps, ITextNodeStyle>> {
    return new Text();
  }
}
