import { NgModule } from '@angular/core';
import { ForumModeratorManagementComponent } from './forum-moderator-management.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { MultiSelectModule } from '@shared/multi-select/multi-select.module';
import { ForumModeratorManagementValidationPipe } from './forum-moderator-management-validation.pipe';
import { StUtilsArrayModule } from '@stlmpp/utils';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  imports: [
    MultiSelectModule,
    ModalModule,
    StUtilsArrayModule,
    TooltipModule,
    ForumModeratorManagementComponent,
    ForumModeratorManagementValidationPipe,
  ],
})
export class ForumModeratorManagementModule {}
