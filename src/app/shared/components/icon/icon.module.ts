import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconMdiComponent } from './icon.component';
import { FlagModule } from './flag/flag.module';

const DECLARATIONS = [IconComponent, IconMdiComponent];
const MODULES = [CommonModule];
const EXPORTS = [FlagModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES, ...EXPORTS],
})
export class IconModule {}
