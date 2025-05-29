import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { ButtonModule } from '../button/button.module';
import { SelectModule } from '../select/select.module';
import { StControlModelModule } from '@stlmpp/control';
import { TooltipModule } from '../tooltip/tooltip.module';
import { StUtilsNumberModule } from '@stlmpp/utils';

const DECLARATIONS = [PaginationComponent];
const MODULES = [
  CommonModule,
  TooltipModule.forFeature({ delay: 300 }),
  SelectModule,
  StControlModelModule,
  ButtonModule,
  StUtilsNumberModule,
];
const EXPORTS = [CommonModule, TooltipModule, SelectModule, StControlModelModule, ButtonModule, StUtilsNumberModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...EXPORTS],
})
export class PaginationModule {}
