import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { ButtonModule } from '../button/button.module';
import { SelectModule } from '../select/select.module';
import { StControlModule } from '@stlmpp/control';
import { TooltipModule } from '../tooltip/tooltip.module';
import { StUtilsNumberModule } from '@stlmpp/utils';

const DECLARATIONS = [PaginationComponent];
const MODULES = [
  CommonModule,
  TooltipModule.forChild({ delay: 300 }),
  SelectModule,
  StControlModule,
  ButtonModule,
  StUtilsNumberModule,
];
const EXPORTS = [CommonModule, TooltipModule, SelectModule, StControlModule, ButtonModule, StUtilsNumberModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...EXPORTS],
})
export class PaginationModule {}
