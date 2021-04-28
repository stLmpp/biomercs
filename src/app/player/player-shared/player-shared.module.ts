import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerSearchModalComponent } from './player-search-modal/player-search-modal.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { StControlModule } from '@stlmpp/control';
import { ListModule } from '@shared/components/list/list.module';
import { FormModule } from '@shared/components/form/form.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';

const DECLARATIONS = [PlayerSearchModalComponent];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [
    CommonModule,
    ModalModule,
    ButtonModule,
    StControlModule,
    ListModule,
    FormModule,
    PaginationModule,
    NgLetModule,
    SpinnerModule,
  ],
  exports: [...DECLARATIONS],
})
export class PlayerSharedModule {}
