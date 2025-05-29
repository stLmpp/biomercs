import { NgModule } from '@angular/core';
import { ForumCategoryAddEditComponent } from './forum-category-add-edit.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { ButtonModule } from '@shared/components/button/button.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';

@NgModule({
  imports: [
    ModalModule,
    SpinnerModule,
    FormModule,
    StControlModule,
    ButtonModule,
    CheckboxModule,
    ForumCategoryAddEditComponent,
  ],
})
export class ForumCategoryAddEditModule {}
