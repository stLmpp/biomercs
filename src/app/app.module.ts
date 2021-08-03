import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environment/environment';
import { ModalModule } from '@shared/components/modal/modal.module';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { HeaderModule } from './header/header.module';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FooterModule } from './footer/footer.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule.forRoot(),
    ModalModule.forRoot(),
    SnackBarModule.forRoot(),
    HeaderModule,
    NgProgressModule.withConfig({ color: '#00acff', spinner: false, debounceTime: 100 }),
    NgProgressRouterModule,
    CurrencyMaskModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    FooterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
