import { NgModule } from '@angular/core';
import { PlayerSearchModalComponent } from './player-search-modal/player-search-modal.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { FormModule } from '@shared/components/form/form.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { NgLetModule } from '@stlmpp/utils';
import { StControlModule } from '@stlmpp/control';

const DECLARATIONS = [PlayerSearchModalComponent];
const MODULES = [ListModule, PaginationModule, ModalModule, FormModule, StControlModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES, NgLetModule],
  exports: [...DECLARATIONS, ...MODULES],
})
export class PlayerSharedModule {}
