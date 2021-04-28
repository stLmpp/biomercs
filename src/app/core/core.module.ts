import { APP_INITIALIZER, LOCALE_ID, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NAVIGATOR, WINDOW, WINDOW_PROVIDERS } from './window.service';
import { ApiInterceptor } from './api.interceptor';
import { LoadingInterceptor } from './loading/loading.interceptor';
import { DateInterceptor } from './date.interceptor';
import { FormatErrorInterceptor } from './error/format-error.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorComponent } from './error/error.component';
import { HandleErrorDevInterceptor } from './error/handle-error-dev.interceptor';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { AuthErrorInterceptor } from '../auth/auth-error.interceptor';
import { AbstractRegionService } from '../region/region-service.token';
import { RegionService } from '../region/region.service';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ScoreService } from '../score/score.service';
import { AbstractScoreService } from '../score/abstract-score.service';
import { AbstractPlayerService } from '../player/abstract-player.service';
import { PlayerService } from '../player/player.service';

const withInterceptors = (...interceptors: any[]): Provider[] =>
  interceptors.map(useClass => ({
    provide: HTTP_INTERCEPTORS,
    useClass,
    multi: true,
  }));

registerLocaleData(localePt);

@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ModalModule, ButtonModule, SnackBarModule],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: LOCALE_ID,
          useValue: 'pt-BR',
        },
        ...WINDOW_PROVIDERS,
        ...withInterceptors(
          AuthInterceptor,
          AuthErrorInterceptor,
          ApiInterceptor,
          LoadingInterceptor,
          DateInterceptor,
          HandleErrorDevInterceptor,
          FormatErrorInterceptor
        ),
        {
          provide: APP_INITIALIZER,
          useFactory: (authService: AuthService) => () => authService.autoLogin().toPromise(),
          deps: [AuthService],
          multi: true,
        },
        { provide: AbstractRegionService, useExisting: RegionService },
        { provide: NAVIGATOR, useFactory: (window: Window) => window.navigator ?? {}, deps: [WINDOW] },
        { provide: AbstractScoreService, useExisting: ScoreService },
        { provide: AbstractPlayerService, useExisting: PlayerService },
      ],
    };
  }
}
