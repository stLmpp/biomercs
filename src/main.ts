import { ApplicationRef, enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from '@environment/environment';
import { enableDebugTools, BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CoreModule } from './app/core/core.module';
import { HeaderModule } from './app/header/header.module';
import { provideNgProgressOptions } from 'ngx-progressbar';
import { provideNgProgressRouter } from 'ngx-progressbar/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FooterModule } from './app/footer/footer.module';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideNgProgressOptions({
      spinner: false,
      debounceTime: 100,
    }),
    provideNgProgressRouter({}),
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      CoreModule.forRoot(),
      HeaderModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
      FooterModule
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
})
  .then(moduleRef => {
    if (!environment.production) {
      const applicationRef = moduleRef.injector.get(ApplicationRef);
      const componentRef = applicationRef.components[0];
      enableDebugTools(componentRef);
    }
  })
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
