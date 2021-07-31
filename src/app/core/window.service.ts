import { isPlatformBrowser } from '@angular/common';
import { ClassProvider, FactoryProvider, Injectable, InjectionToken, PLATFORM_ID } from '@angular/core';

export const WINDOW = new InjectionToken('WindowToken');
export abstract class WindowRef {
  get nativeWindow(): Window | Record<string, unknown> {
    throw new Error('Not implemented.');
  }
}
@Injectable({ providedIn: 'root' })
export class BrowserWindowRef extends WindowRef {
  override get nativeWindow(): Window | Record<string, unknown> {
    return window;
  }
}
export function windowFactory(
  browserWindowRef: BrowserWindowRef,
  platformId: Record<string, unknown>
): Window | Record<string, unknown> {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow;
  }
  return {};
}

const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef,
};

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
  deps: [WindowRef, PLATFORM_ID],
};

export const WINDOW_PROVIDERS = [browserWindowProvider, windowProvider];
