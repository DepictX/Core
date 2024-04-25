import { IElementProps } from '../interface';

import { Element } from './Element';

const RESERVED_PROPS = new Set(['key', 'ref']);

interface ICreateElementConfig {
  key?: string;
  ref?: any;
  [props: string]: any;
}

export function createElement(
  type: any,
  config: ICreateElementConfig | null,
  ...children: Element[]
) {
  const props: IElementProps = { children };
  config && Object.keys(config).forEach(key => !RESERVED_PROPS.has(key) && (props[key] = config[key]));
  return Element.create(type, config?.key, config?.ref, props);
}

export { Element };
