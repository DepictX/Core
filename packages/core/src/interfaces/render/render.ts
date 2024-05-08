import { Extension } from '../../extension';
import { createIdentifier } from '../../injector';

export interface IRenderer extends Extension {
  render(): void;
}

export const RenderExtensionId = createIdentifier<IRenderer>('extension.render');
