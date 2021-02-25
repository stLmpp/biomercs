import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { OptionComponent } from './option.component';
import { IconModule } from '../icon/icon.module';
import { A11yModule } from '@angular/cdk/a11y';
import { OptgroupComponent } from './optgroup.component';

const DECLARATIONS = [SelectComponent, OptionComponent, OptgroupComponent];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, IconModule, A11yModule],
  exports: [...DECLARATIONS],
})
export class SelectModule {}
