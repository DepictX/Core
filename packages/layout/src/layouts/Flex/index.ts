import { INode } from 'engine';

export * from './Flex';

export function flexLayout(node: INode) {
  const flexDirection = node.props.flexDirection || 'row';
  const alignItems = node.props.alignItems || 'stretch';
  const justifyContent = node.props.justifyContent || 'flex-start';

  if (flexDirection === 'row' || flexDirection === 'row-reverse') {
    flexDirectionRow(node, flexDirection, alignItems, justifyContent);
  }
  // else {
  //   return flexDirectionColumn(virtualDom, flexDirection, alignItems, justifyContent);
  // }
}

function flexDirectionRow(
  node: INode,
  _flexDirection: string,
  alignItems: string,
  _justifyContent: string,
) {
  let totalFlex = 0;
  const children = node.children;

  children.forEach(child => {
    totalFlex += child.props.flex || 1;
  });

  if (!node.metrics) {
    node.metrics = {
      width: node.parent?.metrics?.width || 100,
      height: node.props.style?.height || 0,
      left: 0,
      top: 0,
    };
  }

  let currentLeft = 0;
  let maxHeight = 0;
  children.forEach(child => {
    const flex = child.props.flex || 1;
    const childWidth = (flex / totalFlex) * node.metrics!.width;

    child.metrics = {
      width: childWidth,
      height: 0,
      left: currentLeft,
      top: 0,
    };
    // child.props.style.left = currentLeft;

    const childHeight = child.props.style?.height || 0;
    maxHeight = Math.max(maxHeight, childHeight);

    if (alignItems === 'center') {
      child.metrics.top = (maxHeight - childHeight) / 2;
    } else if (alignItems === 'flex-end') {
      child.metrics.top = maxHeight - childHeight;
    } else {
      // 默认为 'stretch' 或 'flex-start'
      child.metrics.top = 0;
    }

    currentLeft += childWidth;
  });

  let containerHeight = maxHeight;
  if (alignItems === 'stretch') {
    containerHeight = node.metrics.height || maxHeight;
    children.forEach(child => {
      child.metrics!.height = containerHeight;
    });
  }
}
