import { NgModule } from '@angular/core';
import { ForumSubCategoryModeratorManagementComponent } from './forum-sub-category-moderator-management.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { MultiSelectModule } from '@shared/multi-select/multi-select.module';
import { StUtilsArrayModule } from '@stlmpp/utils';
import { ForumSubCategoryModeratorManagementValidationPipe } from './forum-sub-category-moderator-management-validation.pipe';

@NgModule({
  declarations: [ForumSubCategoryModeratorManagementComponent, ForumSubCategoryModeratorManagementValidationPipe],
  imports: [MultiSelectModule, ModalModule, StUtilsArrayModule],
})
export class ForumSubCategoryModeratorManagementModule {}
