import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { EntityStore } from '@stlmpp/store';
import { environment } from '@environment/environment';

const cacheMap = new Map<string, any>();
const timeoutMap = new Map<string, any>();

function cache(key: string, value: any): void {
  timeoutMap.set(
    key,
    setTimeout(() => {
      cacheMap.set(key, null);
    }, environment.cacheTimeout)
  );
  cacheMap.set(key, value);
}

export function httpCache<T>(store: EntityStore<any, any, any>, params: any[]): MonoTypeOperatorFunction<T> {
  const key = (store as any).options.name + '-' + params.map(param => '' + param).join('-');
  const hasCache = !!cacheMap.get(key);
  return source =>
    new Observable<T>(subscriber => {
      if (hasCache) {
        const values = cacheMap.get(key);
        subscriber.next(values);
        subscriber.complete();
      } else {
        source.subscribe({
          next(value): void {
            cache(key, value);
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
