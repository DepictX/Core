import { IElementProps } from '../interfaces';

import { Element } from './element';

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
