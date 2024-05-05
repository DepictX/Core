import { Container } from 'inversify';

import { createIdentifier } from './create-identifier';

export class Injector extends Container {}

export const InjectorId = createIdentifier<Injector>(Symbol.for('service.injector'));
