import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent, ListControlValue, ListSelectable } from './list.component';
import { ListItemComponent } from './list-item.component';
import { BioCommonModule } from '../common/bio-common.module';
import { ListItemLineDirective } from '@shared/components/list/list-item-line.directive';

const DECLARATIONS = [ListComponent, ListItemComponent, ListControlValue, ListItemLineDirective, ListSelectable];
const MODULES = [CommonModule, BioCommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ListModule {}
