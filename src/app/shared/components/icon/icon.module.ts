import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from './icon.component';
import { FlagModule } from './flag/flag.module';

@NgModule({
  declarations: [IconComponent],
  exports: [IconComponent, FlagModule],
  imports: [CommonModule],
})
export class IconModule {}
