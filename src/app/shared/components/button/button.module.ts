import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { IconModule } from '../icon/icon.module';

const DECLARATIONS = [ButtonComponent];
const MODULES = [CommonModule, SpinnerModule, IconModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ButtonModule {}
