import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminBanUserRoutingModule } from './admin-ban-user-routing.module';
import { AdminBanUserComponent } from './admin-ban-user.component';
import { TitleModule } from '@shared/title/title.module';
import { ListModule } from '@shared/components/list/list.module';
import { FormModule } from '@shared/components/form/form.module';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { NgLetModule } from '@stlmpp/utils';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { DateModule } from '@shared/date/date.module';

@NgModule({
  declarations: [AdminBanUserComponent],
  imports: [
    CommonModule,
    AdminBanUserRoutingModule,
    TitleModule,
    ListModule,
    FormModule,
    CardModule,
    PaginationModule,
    NgLetModule,
    AuthSharedModule,
    DateModule,
  ],
})
export class AdminBanUserModule {}
