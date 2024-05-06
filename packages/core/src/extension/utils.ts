import { Extension, IExtensionCtor } from './extension';

export function isExtensionCtor(E: any): E is IExtensionCtor {
  return E.constructor === Extension.constructor;
}
