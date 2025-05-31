import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlagComponent } from './flag.component';

const DECLARATIONS = [FlagComponent];
const MODULES = [CommonModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class FlagModule {}
