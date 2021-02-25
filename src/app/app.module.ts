import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StUtilsModule } from '@stlmpp/utils';
import { StStoreModule } from '@stlmpp/store';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StRouterModule } from '@stlmpp/router';
import { environment } from '@environment/environment';
import { StControlModule } from '@stlmpp/control';
import { ModalModule } from '@shared/components/modal/modal.module';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { HeaderModule } from './header/header.module';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressRouterModule } from 'ngx-progressbar/router';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule.forRoot(),
    StUtilsModule.forRoot(),
    StStoreModule.forRoot({ production: environment.production }),
    StRouterModule.forRoot(),
    StControlModule.forRoot(),
    ModalModule.forRoot(),
    SnackBarModule.forRoot(),
    HeaderModule,
    NgProgressModule.withConfig({ color: '#00acff', spinner: false, debounceTime: 100 }),
    NgProgressRouterModule,
    TooltipModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
