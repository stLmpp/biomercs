import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, IconMdiComponent } from './icon.component';
import { FlagModule } from './flag/flag.module';

@NgModule({
  declarations: [IconComponent, IconMdiComponent],
  exports: [IconComponent, FlagModule, IconMdiComponent],
  imports: [CommonModule],
})
export class IconModule {}
