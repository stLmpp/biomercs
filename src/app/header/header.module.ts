import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { RouterModule } from '@angular/router';
import { NgLetModule } from '@stlmpp/utils';
import { MenuModule } from '@shared/components/menu/menu.module';
import { BadgeModule } from '@shared/components/badge/badge.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ListModule } from '@shared/components/list/list.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  declarations: [HeaderComponent, SideMenuComponent],
  imports: [MenuModule, ListModule, ButtonModule, RouterModule, TooltipModule, NgLetModule, BadgeModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
