import { createIdentifier } from '../../injector';

export interface IRenderer {
  render(): void;
}

export const RenderExtensionId = createIdentifier('extension.render');
