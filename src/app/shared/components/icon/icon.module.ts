import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { IconMdiComponent } from './icon-mdi.component';

const DECLARATIONS = [IconComponent, IconMdiComponent];
const MODULES = [CommonModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class IconModule {}
