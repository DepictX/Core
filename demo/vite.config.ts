import { PluginOption, defineConfig } from 'vite'
import * as defaultConfig from '@depict-x/vite-config'
// import react from '@vitejs/plugin-react'
// @ts-ignore
import { transformSync } from '@babel/core';
import { resolve } from 'path'

export default defineConfig({
  ...defaultConfig.default,
  build: {
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  plugins: [
    {
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
    } as PluginOption,
  ],
  esbuild: {
    jsxFactory: 'DepictX.createElement',
    jsxInject: `import * as DepictX from 'engine'`,
  },
});
