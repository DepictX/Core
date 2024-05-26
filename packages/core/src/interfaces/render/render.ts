import { Extension } from '../../extension';
import { createIdentifier } from '../../injector';
import { Node } from '../../node';

export interface IRenderer extends Extension {
  render(node: Node): void;
}

export const RenderExtensionId = createIdentifier<IRenderer>('extension.render');
