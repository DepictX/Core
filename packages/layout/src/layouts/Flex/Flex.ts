/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IDefaultProps,
  LAYOUT_TYPE,
  INode,
  InternalLayout,
  MEASUREMENTS,
  BLOCK,
} from 'engine';

import { DEFAULT_METRICS } from '../../consts';
import { View } from '../View';

export const FLEX_SYMBOL = Symbol('Flex');

export interface IFlexProps extends IDefaultProps {
  gap?: number;
  flexDirection?: 'row' | 'column';
  flexWrap?: 'nowrap' | 'wrap';
  justifyContent?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch'
    | 'baseline';
  alignItems?: 'start' | 'end' | 'center' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'space-between' | 'space-around';
}

export interface IFlexItemProps {
  flexBasic?: 'auto' | number | string; // percent
  flexGrow?: 0 | number;
  flexShrink?: 1 | number;
  // 暂不实现
  // alignSelf?: 'start' | 'end' | 'center' | 'stretch';
}

export const Flex: InternalLayout<IFlexProps> = props => {
  return props.children;
};

Flex[LAYOUT_TYPE] = BLOCK;
/**
 * https://www.w3.org/html/ig/zh/wiki/Css3-flexbox/zh-hans#flex-base-size
 */
Flex[MEASUREMENTS] = {
  prepare(node: INode<IFlexProps>, ctx) {
    const children = node.children;

    if (!node.metrics) node.metrics = { ...DEFAULT_METRICS };

    console.assert(
      children.every(n => n.type === View),
      'Flex items must be <View> nodes',
    );

    const {
      gap, flexDirection, flexWrap, justifyContent, alignItems, 
    } =
      node.props;

    if (flexDirection === 'column') {
      node.metrics.width =
        node.parent?.metrics?.width || ctx.containerConstrains.width;
      children.forEach(child => {});
    }

    return {
      fitContent:
        flexDirection === 'column'
          ? Math.max(
            ...children.map(c => ctx.getNodeConstrains(c).fitContent || 0),
          )
          : children.reduce(
            (s, c) => s + (ctx.getNodeConstrains(c).fitContent || 0),
            0,
          ),
    };
  },
  measure(node: INode<IFlexProps>, ctx) {
    ctx.skipChildren = true;

    const children: INode<IFlexItemProps>[] = node.children;
    const {
      gap = 0,
      flexDirection = 'row',
      flexWrap = 'nowrap',
      justifyContent = 'start',
      alignItems = 'start',
    } = node.props;
    const isWrap = flexWrap !== 'nowrap';
    const width = node.parent?.metrics?.width || ctx.containerConstrains.width;
    const lines = [0];

    node.metrics!.width = width;

    function shareSpace(
      items: { child: INode<IFlexItemProps>; supposeWidth: number; frozen?: boolean }[],
      space: number,
    ) {
      const flexibleItems = items.filter(({ child, supposeWidth, frozen }) => {
        const { flexGrow = 0, flexShrink = 1 } = child.props;
        if (!space || !flexGrow && !flexShrink || frozen) {
          child.metrics!.width = supposeWidth;
          return false;
        }
        return true;
      });

      if (!flexibleItems.length) return;

      let illegal = false;

      if (space < 0) {
        const shrunkSpaces = flexibleItems.map(({ child, supposeWidth }) =>
          (child.props.flexShrink ?? 1) * supposeWidth);
        const total = shrunkSpaces.reduce((a, b) => a + b, 0);
        const ratios = shrunkSpaces.map(space => space / total);
        ratios.forEach((ratio, index) => {
          const { child, supposeWidth } = flexibleItems[index];
          const width = ratio * space + supposeWidth;

          if (child.style?.minWidth && width < child.style?.minWidth) {
            illegal = true;
            child.metrics!.width = child.style.minWidth;
            flexibleItems[index].frozen = true;
            space -= width - child.style.minWidth;
          } else {
            child.metrics!.width = width;
          }
        });
      } else {
        let total = flexibleItems.reduce((s, { child }) => s + (child.props.flexGrow ?? 0), 0);
        if (total < 1) total = 1;

        flexibleItems.forEach(item => {
          const { child, supposeWidth } = item;
          const width = child.props.flexGrow ? Math.floor(child.props.flexGrow) / total * supposeWidth : supposeWidth;

          if (child.style?.maxWidth && width > child.style.maxWidth) {
            illegal = true;
            child.metrics!.width = child.style.maxWidth;
            item.frozen = true;
            space -= width - child.style.maxWidth;
          } else {
            child.metrics!.width = width;
          }
        });
      }

      if (illegal) {
        shareSpace(items, space);
      }
    }

    if (flexDirection !== 'column') {
      let space = width;
      let lineItems: { child: INode; supposeWidth: number }[] = [];

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const {
          minWidth = 0,
          maxWidth = Infinity,
          fitContent = 0,
        } = ctx.getNodeConstrains(child);
        const basic = child.props.flexBasic || child.style?.width;
        const supposeWidth = Math.max(
          minWidth,
          Math.min(
            maxWidth,
            !basic || basic === 'auto'
              ? fitContent
              : typeof basic === 'number'
                ? basic
                : width * Math.max(parseInt(basic), 100) * 100,
          ),
        );
        const outOfSpace = supposeWidth && space < supposeWidth + (i ? gap : 0);

        if (isWrap && outOfSpace) {
          // need a new line
          shareSpace(lineItems, space);
          justify(lineItems.map(({ child }) => child), node);

          if (i < children.length) lines.push(i);
          lineItems = [];
          space = width;
        } else {
          space -= supposeWidth + (i ? gap : 0);
        }

        lineItems.push({
          child,
          supposeWidth, 
        });
      }

      if (lineItems.length) {
        // share the space
        shareSpace(lineItems, space);
        justify(lineItems.map(({ child }) => child), node);
      }

      ctx.storage.lines = lines;
    }
  },
  postMeasure(node: INode<IFlexProps>, ctx) {
    const children: INode<IFlexItemProps>[] = node.children;
    const {
      gap = 0,
      flexDirection = 'row',
      alignItems = 'start',
    } = node.props;

    if (flexDirection === 'row') {
      const lines: number[] = ctx.storage.lines;
      const childrenGroups = lines.map((line, index) => children.slice(line, lines[index + 1]));

      let lastTop = 0;
      childrenGroups.forEach((children, index) => {
        const maxHeight = children.reduce((max, child) => Math.max(max, child.metrics!.height!), 0);
        children.forEach(child => {
          child.metrics!.height = maxHeight;
          child.metrics!.top = lastTop;
        });
        lastTop += maxHeight + gap;
      });

      node.metrics!.height = childrenGroups.reduce((h, group) =>
        h + group[0].metrics!.height, 0) + (lines.length - 1) * gap;
    }
  },
};

function justify(items: INode<IFlexItemProps>[], parent: INode<IFlexProps>) {
  const { gap = 0, justifyContent = 'start' } = parent.props;
  let left = 0;
  if (justifyContent === 'start') {
    items.forEach((child, index) => {
      child.metrics!.left = left + (index ? items[index - 1].metrics!.width + gap : 0);
      left = child.metrics!.left;
    });
  }
}
