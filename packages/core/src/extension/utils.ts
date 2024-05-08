import { Extension, IExtensionCtor } from './extension';

export function isExtensionCtor<T>(E: any): E is IExtensionCtor<T> {
  return E.constructor === Extension.constructor;
}
