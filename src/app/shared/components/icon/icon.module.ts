import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { FlagModule } from './flag/flag.module';
import { IconMdiComponent } from './mdi/icon-mdi.component';

const DECLARATIONS = [IconComponent, IconMdiComponent];
const MODULES = [CommonModule];
const EXPORTS = [FlagModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES, ...EXPORTS],
})
export class IconModule {}
