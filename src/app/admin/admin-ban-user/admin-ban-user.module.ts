import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminBanUserRoutingModule } from './admin-ban-user-routing.module';
import { AdminBanUserComponent } from './admin-ban-user.component';

import { ListModule } from '@shared/components/list/list.module';
import { FormModule } from '@shared/components/form/form.module';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { NgLetModule } from '@stlmpp/utils';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';

@NgModule({
  imports: [
    CommonModule,
    AdminBanUserRoutingModule,
    ListModule,
    FormModule,
    CardModule,
    PaginationModule,
    NgLetModule,
    AuthSharedModule,
    AdminBanUserComponent,
  ],
})
export class AdminBanUserModule {}
