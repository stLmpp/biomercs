import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, SpinnerModule, IconModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
