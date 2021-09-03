import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDirective, ListControlValue, ListSelectable } from './list.directive';
import { ListItemComponent } from './list-item.component';
import { BioCommonModule } from '../common/bio-common.module';
import { ListItemLineDirective } from '@shared/components/list/list-item-line.directive';

const DECLARATIONS = [ListDirective, ListItemComponent, ListControlValue, ListItemLineDirective, ListSelectable];
const MODULES = [CommonModule, BioCommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ListModule {}
