import { Engine } from '../core';
import { Node } from '../node';

/**
 * Module 基本类型定义
 */
export interface Module {
  type: string;

  install: (engine: Engine) => void;

  uninstall: () => void;
}

export interface ViewModule extends Module {
  type: 'View';

  draw: (canvas: HTMLCanvasElement, node: Node) => void;
}

export interface LayoutModule extends Module {
  type: 'Layout';
}

// export interface
