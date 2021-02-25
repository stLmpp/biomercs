import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent, ListControlValue } from './list.component';
import { ListItemComponent } from './list-item.component';
import { BioCommonModule } from '../common/bio-common.module';
import { StControlModule } from '@stlmpp/control';

const DECLARATIONS = [ListComponent, ListItemComponent, ListControlValue];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, BioCommonModule, StControlModule],
  exports: [...DECLARATIONS, BioCommonModule],
})
export class ListModule {}
