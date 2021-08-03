import { APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { WINDOW, WINDOW_PROVIDERS } from './window.service';
import { ApiInterceptor } from './api.interceptor';
import { DateInterceptor } from './date.interceptor';
import { FormatErrorInterceptor } from './error/format-error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HandleErrorDevInterceptor } from './error/handle-error-dev.interceptor';
import { registerLocaleData } from '@angular/common';
import { AuthAutoLoginService } from '../auth/auth-auto-login.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthErrorInterceptor } from '../auth/auth-error.interceptor';
import localePt from '@angular/common/locales/pt';
import { RetryInterceptor } from './retry.interceptor';
import { HighlightModule } from '@shared/highlight/highlight.module';
import { NAVIGATOR } from './navigator.token';
import { DEFAULT_TOOLTIP_CONFIG, TOOLTIP_DEFAULT_CONFIG } from '@shared/components/tooltip/tooltip-token';
import { MASK_CONFIG } from '@shared/mask/mask-config.token';

const withInterceptors = (...interceptors: any[]): Provider[] =>
  interceptors.map(useClass => ({
    provide: HTTP_INTERCEPTORS,
    useClass,
    multi: true,
  }));

registerLocaleData(localePt);

@NgModule({
  imports: [HighlightModule.forRoot({ sql: () => import('highlight.js/lib/languages/sql') })],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        { provide: LOCALE_ID, useValue: 'en-US' },
        ...WINDOW_PROVIDERS,
        ...withInterceptors(
          AuthInterceptor,
          AuthErrorInterceptor,
          ApiInterceptor,
          DateInterceptor,
          HandleErrorDevInterceptor,
          RetryInterceptor,
          FormatErrorInterceptor
        ),
        {
          provide: APP_INITIALIZER,
          useFactory: (authAutoLoginService: AuthAutoLoginService) => () => authAutoLoginService.autoLogin(),
          deps: [AuthAutoLoginService],
          multi: true,
        },
        { provide: NAVIGATOR, useFactory: (window: Window) => window.navigator ?? {}, deps: [WINDOW] },
        { provide: TOOLTIP_DEFAULT_CONFIG, useValue: DEFAULT_TOOLTIP_CONFIG },
        { provide: MASK_CONFIG, useValue: {} },
      ],
    };
  }
}
