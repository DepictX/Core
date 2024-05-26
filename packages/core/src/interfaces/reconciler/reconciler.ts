import { Extension } from '../../extension';
import { createIdentifier } from '../../injector';
import { Node } from '../../node';

export interface IReconciler extends Extension {
  setRoot(node: Node): void;
  start(): void;
}

export const ReconcilerExtensionId = createIdentifier<IReconciler>('extension.reconciler');