import { DepictX, RenderExtensionId, LayoutExtensionId, ReconcilerExtensionId } from '@depict-x/core';

import { Renderer } from '@depict-x/renderer';
import { FlexPlugin } from '@depict-plugins/flex';
import { LayoutExtension } from '@depict-x/layout';
import { InlinePlugin } from '@depict-plugins/inline';
import { ViewPlugin } from '@depict-plugins/view';
import { TextPlugin } from '@depict-plugins/text';
import { DslExtension, IElement } from '@depict-x/dsl';
import { Reconciler } from '@depict-x/reconciler';

export function createDepictX(canvas: HTMLCanvasElement) {
  const depictX = new DepictX();
  depictX.registerExtension(LayoutExtensionId, LayoutExtension, { canvas });
  depictX.registerExtension(RenderExtensionId, Renderer, { canvas });
  depictX.registerExtension(ReconcilerExtensionId, Reconciler);
  depictX.registerExtension(DslExtension);
  
  depictX.registerPlugin(FlexPlugin);
  depictX.registerPlugin(InlinePlugin);
  depictX.registerPlugin(ViewPlugin);
  depictX.registerPlugin(TextPlugin);

  depictX.start();

  const dsl = depictX.getExtension(DslExtension);

  return {
    render: (root: IElement) => {
      depictX.start();
      dsl.render(root);
    },
  };
}