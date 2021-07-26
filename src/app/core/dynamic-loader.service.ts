import { Compiler, Inject, Injectable, Type } from '@angular/core';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { NAVIGATOR } from './window.service';

export type LazyFn = () => Promise<Type<any>>;

@Injectable({ providedIn: 'root' })
export class DynamicLoaderService {
  constructor(private compiler: Compiler, @Inject(NAVIGATOR) private navigator: Navigator) {}

  private readonly _loaded = new Set<Type<any>>();
  private readonly _loading = new Map<Type<any>, boolean>();

  private _isSlowConnection(): boolean {
    const connection: { effectiveType: string; saveData: boolean } | undefined = (this.navigator as any).connection;
    return connection?.effectiveType !== '4g' || connection?.saveData;
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
