import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { OptionComponent } from './option.component';
import { IconModule } from '../icon/icon.module';
import { A11yModule } from '@angular/cdk/a11y';
import { OptgroupComponent } from './optgroup.component';
import { SelectMultipleComponent } from '@shared/components/select/select-multiple.component';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';

const DECLARATIONS = [SelectComponent, OptionComponent, OptgroupComponent, SelectMultipleComponent];
const MODULES = [CommonModule, IconModule, A11yModule, CheckboxModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class SelectModule {}
