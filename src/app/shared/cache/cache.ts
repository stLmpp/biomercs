import { finalize, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { Injectable } from '@angular/core';

interface CacheStore {
  value: any;
  timeout: () => void;
}

class Cache {
  constructor(private timeout = environment.cacheTimeout) {}

  private _cache = new Map<string, CacheStore>();

  private _serializeKey(params: any = ''): string {
    return JSON.stringify(params);
  }

  private _setCache(key: string, value: any): void {
    const timeout = setTimeout(() => {
      this._cache.delete(key);
    }, this.timeout);
    this._cache.set(key, { timeout: () => clearTimeout(timeout), value });
  }

  burstCache(params: any = ''): void {
    const key = this._serializeKey(params);
    if (this._cache.has(key)) {
      const { timeout } = this._cache.get(key)!;
      timeout();
      this._cache.delete(key);
    }
  }

  burstAllCache(): void {
    for (const [, { timeout }] of this._cache) {
      timeout();
    }
    this._cache.clear();
  }

  use<T>(params: any = ''): MonoTypeOperatorFunction<T> {
    const key = JSON.stringify(params);
    return source =>
      new Observable<T>(subscriber => {
        if (this._cache.has(key)) {
          subscriber.next(this._cache.get(key)!.value);
          subscriber.complete();
        } else {
          source.subscribe({
            next: value => {
              this._setCache(key, value);
              subscriber.next(value);
            },
            error(err): void {
              subscriber.error(err);
            },
            complete(): void {
              subscriber.complete();
            },
          });
        }
      });
  }

  burst<T>(params: any = ''): MonoTypeOperatorFunction<T> {
    return finalize(() => {
      this.burstCache(params);
    });
  }

  burstAll<T>(): MonoTypeOperatorFunction<T> {
    return finalize(() => {
      this.burstAllCache();
    });
  }
}

@Injectable({ providedIn: 'root' })
export class CacheService {
  private readonly _caches: Cache[] = [];

  createCache(timeout?: number): Cache {
    const cache = new Cache(timeout);
    this._caches.push(cache);
    return cache;
  }

  burstAll<T>(): MonoTypeOperatorFunction<T> {
    return finalize(() => {
      for (const cache of this._caches) {
        cache.burstAllCache();
      }
    });
  }
}
