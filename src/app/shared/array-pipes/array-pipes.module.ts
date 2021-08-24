import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDeletedPipe } from './filter-deleted.pipe';

@NgModule({
  declarations: [FilterDeletedPipe],
  exports: [FilterDeletedPipe],
  imports: [CommonModule],
})
export class ArrayPipesModule {}
