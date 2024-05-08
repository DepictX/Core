import { Extension } from '@depict-x/core';
import { injectable } from 'inversify';

export interface IRendererOptions {
  container: HTMLElement;
}

@injectable()
export class Renderer extends Extension<IRendererOptions> {

  onInit(options: IRendererOptions) {
    this._options = options;
    console.warn('Renderer init');
  }

  onReady(): void {
    this._options.container;
  }
}
