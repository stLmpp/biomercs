import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from './menu-trigger.directive';
import { MenuComponent } from './menu.component';
import { MenuItemButtonDirective, MenuItemDirective } from './menu-item.directive';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [MenuTriggerDirective, MenuComponent, MenuItemDirective, MenuItemButtonDirective],
  imports: [CommonModule, A11yModule],
  exports: [MenuTriggerDirective, MenuComponent, MenuItemDirective, MenuItemButtonDirective],
})
export class MenuModule {}
