import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTriggerDirective } from './menu-trigger.directive';
import { MenuComponent } from './menu.component';
import { MenuItemButtonDirective, MenuItemDirective } from './menu-item.directive';
import { A11yModule } from '@angular/cdk/a11y';

const DECLARATIONS = [MenuTriggerDirective, MenuComponent, MenuItemDirective, MenuItemButtonDirective];
const MODULES = [CommonModule, A11yModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class MenuModule {}
