import { interfaces } from 'inversify';

export function createIdentifier<T>(key: interfaces.ServiceIdentifier) {
  return key as interfaces.ServiceIdentifier<T>;
}
