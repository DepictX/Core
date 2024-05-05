import {
  inject, injectable, interfaces,
} from 'inversify';
import { Observable, Subject } from 'rxjs';

import { createIdentifier, InjectorId, Injector } from '../injector';

export enum LifecycleStage {
  onInit,
  onStart,
  onReady,
  onDestroy,
}

export interface ILifecycleService {
  stage$: Observable<LifecycleStage>;
  getStage(): LifecycleStage;
}

@injectable()
export class LifecycleService implements ILifecycleService {
  private _stage = LifecycleStage.onInit;

  private _stage$ = new Subject<LifecycleStage>();

  readonly stage$ = this._stage$.asObservable();

  @inject(InjectorId)
  private _injector: Injector;

  next(stage: LifecycleStage) {
    if (this._stage >= stage) return;

    this._stage = stage;
    this._stage$.next(this._stage);
    LifecycleToExtensions.get(this._stage)?.forEach(id => this._injector.get(id));
  }

  getStage(): LifecycleStage {
    return this._stage;
  }
}

const LifecycleToExtensions = new Map<LifecycleStage, Array<interfaces.ServiceIdentifier<unknown>>>();

export function OnLifecycle(
  lifecycleStage: LifecycleStage,
  identifier?: interfaces.ServiceIdentifier<unknown>,
) {
  return function <T extends abstract new (...args: any) => unknown>(target: T) {
    if (!LifecycleToExtensions.has(lifecycleStage)) {
      LifecycleToExtensions.set(lifecycleStage, []);
    }

    LifecycleToExtensions.get(lifecycleStage)!.push(identifier || target);
  };
}

export const LifecycleServiceId = createIdentifier<ILifecycleService>('service.lifecycle');
