import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuffixDirective } from './suffix.directive';
import { PrefixDirective } from './prefix.directive';

const DECLARATIONS = [SuffixDirective, PrefixDirective];
const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class BioCommonModule {}
