import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumCategoriesRoutingModule } from './forum-categories-routing.module';
import { ForumCategoriesComponent } from './forum-categories.component';
import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@stlmpp/utils';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';
import { ArrayPipesModule } from '@shared/array-pipes/array-pipes.module';
import { ForumCategoriesCategoryComponent } from './forum-categories-category/forum-categories-category.component';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { ListModule } from '@shared/components/list/list.module';

@NgModule({
  declarations: [ForumCategoriesComponent, ForumCategoriesCategoryComponent],
  imports: [
    CommonModule,
    ForumCategoriesRoutingModule,
    AccordionModule,
    ButtonModule,
    NgLetModule,
    DragDropModule,
    CheckboxModule,
    ArrayPipesModule,
    AuthSharedModule,
    ListModule,
  ],
})
export class ForumCategoriesModule {}
