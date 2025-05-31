import { Compiler, Injectable, Type, inject } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { NavigatorConnection } from './navigator-connection';

export type LazyFn = () => Promise<Type<any>>;

@Injectable({ providedIn: 'root' })
export class DynamicLoaderService {
  private compiler = inject(Compiler);
  private navigatorConnection = inject(NavigatorConnection);

  private readonly _loaded = new Set<Type<any>>();
  private readonly _loading = new Map<Type<any>, boolean>();

  private _isSlowConnection(): boolean {
    return this.navigatorConnection.effectiveType !== '4g' || !!this.navigatorConnection.saveData;
  }

  async loadModule(moduleFn: LazyFn): Promise<void> {
    const module = await moduleFn();
    if (this._loaded.has(module) || this._loading.has(module)) {
      return;
    }
    this._loading.set(module, true);
    await this.compiler.compileModuleAndAllComponentsAsync(module);
    this._loaded.add(module);
    this._loading.set(module, false);
  }

  preloadRequest<T>(observable: Observable<T>): Subscription {
    if (this._isSlowConnection()) {
      observable = EMPTY;
    }
    return observable.subscribe();
  }
}
