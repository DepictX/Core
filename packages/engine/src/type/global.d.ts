import { DefaultProps } from '../interface';

import { createElement as myCreateElement } from './RenderObject';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      flex: DefaultProps;
    }

    const createElement = myCreateElement;
  }
}
