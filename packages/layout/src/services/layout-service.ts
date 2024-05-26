import {
  Extension, IBaseMetrics, IConstrains, IElementMetrics, ILayout,
  IMeasureContext, IMetrics, Injector, InjectorId, ITextMetrics, Node,
  PluginManagerId,
  TextNode, 
} from '@depict-x/core';
import { Flexible } from '@depict-x/measurement';
import { inject, injectable } from 'inversify';

import { getDefaultMetrics } from './utils';

interface ILayoutExtensionOptions {
  canvas: HTMLCanvasElement;
}

@injectable()
export class LayoutExtension extends Extension<ILayoutExtensionOptions> implements ILayout {
  private _constrains = new WeakMap<Node, IConstrains>();

  private _metrics = new WeakMap<Node, IMetrics>();

  constructor(
    @inject(InjectorId) private _injector: Injector,
  ) {
    super();

    this._injector.bind(Flexible).toSelf();
  }

  measure(node: Node) {
    const containerConstrains = {
      height: this._options.canvas.clientHeight,
      width: this._options.canvas.clientWidth,
    };

    node.descendants({
      self: true,
      post: node => {
        const measurement = this.getMeasurement(node);
        const constrain = measurement.prepare(node, {
          containerConstrains,
          getNodeConstrains: this.getNodeConstrains,
          getMetrics: this.getMetrics.bind(this),
          getBaseMetrics: this.getBaseMetrics.bind(this),
          setMetrics: this.setMetrics.bind(this),
          getLayoutType: this.getLayoutType,
        });
        this._constrains.set(node, constrain);
      }, 
    });

    const skips = new Set<Node>();

    node.descendants({
      self: true,
      pre: (node, storage) => {
        const ctx: IMeasureContext = {
          storage,
          containerConstrains,
          getNodeConstrains: this.getNodeConstrains,
          getMetrics: this.getMetrics.bind(this),
          getBaseMetrics: this.getBaseMetrics.bind(this),
          setMetrics: this.setMetrics.bind(this),
          getLayoutType: this.getLayoutType,
        };
        const measurement = this.getMeasurement(node);
        (!node.parent || !skips.has(node.parent)) && measurement.measure(node, ctx);
        measurement.willHandleChildren && skips.add(node);
      },
      post: (node, storage) => {
        const ctx: IMeasureContext = {
          storage,
          containerConstrains,
          getNodeConstrains: this.getNodeConstrains,
          getMetrics: this.getMetrics.bind(this),
          getBaseMetrics: this.getBaseMetrics.bind(this),
          setMetrics: this.setMetrics.bind(this),
          getLayoutType: this.getLayoutType,
        };
        const measurement = this.getMeasurement(node);
        measurement.postMeasure?.(node, ctx);
      },
    });
  }

  getMetrics<T extends Node>(node: T): T extends TextNode ? ITextMetrics : IElementMetrics {
    if (!this._metrics.has(node)) this._metrics.set(node, getDefaultMetrics(node));
    return this._metrics.get(node)! as T extends TextNode ? ITextMetrics : IElementMetrics;
  }

  getBaseMetrics<T extends Node>(node: T): IBaseMetrics {
    if (node instanceof TextNode) {
      return this.getMetrics(node).rects[0].metrics;
    } else {
      return this.getMetrics(node) as IElementMetrics;
    }
  }

  private getNodeConstrains = (node: Node) => {
    return this._constrains.get(node)!;
  };

  private getLayoutType = (node: Node) => {
    return this.getMeasurement(node).layoutType;
  };

  private setMetrics(node: Node, metrics: IMetrics) {
    this._metrics.set(node, metrics);
  }

  private getMeasurement(node: Node) {
    const pluginManager = this._injector.get(PluginManagerId);
    const measurement = pluginManager.getPluginForNode(node).addMeasurement!();
    if (!measurement) throw new Error('Must register measurement for node!');
    return measurement;
  }
}
