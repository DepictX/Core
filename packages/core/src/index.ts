import 'reflect-metadata';

export { DepictX } from './depict-x';

export { Extension } from './extension';

export { Injector, InjectorId } from './injector';

export { toDisposable, Disposable } from './disposable';

export { RenderExtensionId } from './interfaces/render';
export type { IRenderer } from './interfaces/render';

export { Plugin, PluginManagerId, PluginManager } from './plugin';

export { Node, TextNode } from './node';
export type {
  IDefaultProps, IDefaultStyle, IFontStyle, IStyle, 
} from './node';

export * from './interfaces';
export * from './utils';
