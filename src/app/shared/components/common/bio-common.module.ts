import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuffixDirective } from './suffix.directive';
import { PrefixDirective } from './prefix.directive';

const DECLARATIONS = [SuffixDirective, PrefixDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule],
  exports: [...DECLARATIONS],
})
export class BioCommonModule {}
