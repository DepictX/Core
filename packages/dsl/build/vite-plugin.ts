// @ts-expect-error: no d.ts
import { transformSync } from '@babel/core';
import { Plugin } from 'vite';

export const viteTsxPlugin: Plugin = {
  name: '',
  enforce: 'pre',
  transform: (code, id) => {
    if (/\.tsx$/.test(id)) {
      const result = transformSync(code, {
        plugins: [
          [
            '@babel/plugin-transform-react-jsx',
            {
              pragma: 'DepictX.createElement',
            },
          ],
        ],
      });

      return result ? result.code : code;
    }
  },
};
