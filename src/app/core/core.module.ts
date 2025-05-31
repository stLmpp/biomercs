import { LOCALE_ID, ModuleWithProviders, NgModule, Provider, inject, provideAppInitializer } from '@angular/core';
import { WINDOW, WINDOW_PROVIDERS } from './window.service';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { DateInterceptor } from './interceptor/date.interceptor';
import { FormatErrorInterceptor } from './interceptor/format-error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HandleErrorDevInterceptor } from './interceptor/handle-error-dev.interceptor';
import { registerLocaleData } from '@angular/common';
import { AuthAutoLoginService } from '../auth/auth-auto-login.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthErrorInterceptor } from '../auth/auth-error.interceptor';
import localePt from '@angular/common/locales/pt';
import { RetryInterceptor } from './interceptor/retry.interceptor';
import { HighlightModule } from '@shared/highlight/highlight.module';
import { NAVIGATOR } from './navigator.token';
import { DEFAULT_TOOLTIP_CONFIG, TOOLTIP_DEFAULT_CONFIG } from '@shared/components/tooltip/tooltip-token';
import { MASK_CONFIG } from '@shared/mask/mask-config.token';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { MODAL_DEFAULT_CONFIG, ModalConfig } from '@shared/components/modal/modal.config';
import { SNACK_BAR_DEFAULT_CONFIG, SnackBarConfig } from '@shared/components/snack-bar/snack-bar.config';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { provideHighlightOptions } from 'ngx-highlightjs';

const withInterceptors = (...interceptors: any[]): Provider[] =>
  interceptors.map(useExisting => ({ provide: HTTP_INTERCEPTORS, useExisting, multi: true }));

registerLocaleData(localePt);

@NgModule({
  imports: [
    HighlightModule.forRoot({
      sql: () => import('highlight.js/lib/languages/sql'),
      yaml: () => import('highlight.js/lib/languages/yaml'),
    }),
    SnackBarModule,
  ],
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
        provideAppInitializer(() => {
          const initializerFn = (
            (authAutoLoginService: AuthAutoLoginService) => () =>
              authAutoLoginService.autoLogin()
          )(inject(AuthAutoLoginService));
          return initializerFn();
        }),
        { provide: NAVIGATOR, useFactory: (window: Window) => window.navigator ?? {}, deps: [WINDOW] },
        { provide: TOOLTIP_DEFAULT_CONFIG, useValue: DEFAULT_TOOLTIP_CONFIG },
        { provide: MASK_CONFIG, useValue: {} },
        { provide: CURRENCY_MASK_CONFIG, useValue: {} },
        { provide: MODAL_DEFAULT_CONFIG, useValue: new ModalConfig<any>() },
        { provide: SNACK_BAR_DEFAULT_CONFIG, useValue: new SnackBarConfig() },
        provideHighlightOptions({
          coreLibraryLoader: () => import('highlight.js/lib/core'),
          languages: {
            sql: () => import('highlight.js/lib/languages/sql'),
            yaml: () => import('highlight.js/lib/languages/yaml'),
          },
        }),
      ],
    };
  }
}
