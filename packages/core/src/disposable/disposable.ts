import { injectable, preDestroy } from 'inversify';
import { Observer, SubscriptionLike } from 'rxjs';
import { isSubscription } from 'rxjs/internal/Subscription';

export interface IDisposable {
  dispose(): void;
}

function isObserver(v: SubscriptionLike | (() => void) | Observer<any>): v is Observer<any> {
  return !!(v as Observer<any>).complete;
}

export function toDisposable(observer: Observer<any>): IDisposable;
export function toDisposable(subscription: SubscriptionLike): IDisposable;
export function toDisposable(callback: () => void): IDisposable;
export function toDisposable(v: SubscriptionLike | (() => void) | Observer<any>): IDisposable {
  let disposed = false;

  if (isSubscription(v)) {
    return {
      dispose: () => {
        if (disposed) {
          return;
        }

        disposed = true;
        v.unsubscribe();
      },
    };
  }

  if (isObserver(v)) {
    return {
      dispose: () => {
        if (disposed) {
          return;
        }

        disposed = true;
        v.complete();
      },
    };
  }

  return {
    dispose: () => {
      if (disposed) {
        return;
      }

      disposed = true;
      (v as () => void)();
    },
  };
}

class DisposableCollection implements IDisposable {
  private readonly _disposables = new Set<IDisposable>();

  add(disposable: IDisposable): IDisposable {
    this._disposables.add(disposable);
    return {
      dispose: () => {
        disposable.dispose();
        this._disposables.delete(disposable);
      },
    };
  }

  dispose(): void {
    this._disposables.forEach(item => {
      item.dispose();
    });

    this._disposables.clear();
  }
}

@injectable()
export class Disposable implements IDisposable {
  protected _disposed = false;
  private readonly _collection = new DisposableCollection();

  protected with(disposable: IDisposable | SubscriptionLike): IDisposable {
    const d = isSubscription(disposable) ? toDisposable(disposable) : (disposable as IDisposable);
    return this._collection.add(d);
  }

  /**
   * Service 的 dispose 无需手动触发
   */
  @preDestroy()
  dispose(): void {
    if (this._disposed) {
      return;
    }

    this._disposed = true;
    this._collection.dispose();
  }
}
