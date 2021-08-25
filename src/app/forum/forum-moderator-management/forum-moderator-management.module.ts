import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumModeratorManagementComponent } from './forum-moderator-management.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ListModule } from '@shared/components/list/list.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { AutocompleteModule } from '@shared/components/autocomplete/autocomplete.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  declarations: [ForumModeratorManagementComponent],
  imports: [
    CommonModule,
    ModalModule,
    ListModule,
    FormModule,
    StControlModule,
    AutocompleteModule,
    ButtonModule,
    CheckboxModule,
    TooltipModule,
  ],
})
export class ForumModeratorManagementModule {}
