import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDirective } from './filter.directive';
import { FilterItemDirective } from './filter-item.directive';

const DECLARATIONS = [FilterDirective, FilterItemDirective];

@NgModule({
  imports: [CommonModule, ...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class FilterModule {}
