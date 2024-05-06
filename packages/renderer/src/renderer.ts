import { Extension } from '@depict-x/core';
import { injectable } from 'inversify';

export interface IRendererOptions {

}

@injectable()
export class Renderer<T extends IRendererOptions> extends Extension {
  private _options: T;

  onInit(options: T) {
    this._options = options;
    console.warn('Renderer init');
  }
}
