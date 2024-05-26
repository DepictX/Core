import { Extension } from '../../extension';
import { createIdentifier } from '../../injector';
import { Node, TextNode } from '../../node';
import { IBaseMetrics, IElementMetrics, ITextMetrics } from '../measurement';

export interface ILayout extends Extension {
  measure(node: Node): void;

  getMetrics<T extends Node>(node: T): T extends TextNode ? ITextMetrics : IElementMetrics;

  getBaseMetrics<T extends Node>(node: T): IBaseMetrics;
}

export const LayoutExtensionId = createIdentifier<ILayout>('extension.layout');
