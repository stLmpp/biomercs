import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumSubCategoryAddEditComponent } from './forum-sub-category-add-edit.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ButtonModule } from '@shared/components/button/button.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    StControlModule,
    FormModule,
    TextFieldModule,
    ButtonModule,
    CheckboxModule,
    ForumSubCategoryAddEditComponent,
  ],
})
export class ForumSubCategoryAddEditModule {}
