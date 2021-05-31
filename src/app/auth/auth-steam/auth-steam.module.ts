import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthSteamRoutingModule } from './auth-steam-routing.module';
import { SteamRegisterComponent } from './steam-register/steam-register.component';
import { CardModule } from '@shared/components/card/card.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  declarations: [SteamRegisterComponent],
  imports: [CommonModule, AuthSteamRoutingModule, AuthSharedModule, CardModule, ButtonModule],
})
export class AuthSteamModule {}
