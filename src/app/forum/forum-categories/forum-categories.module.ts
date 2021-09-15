import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumCategoriesRoutingModule } from './forum-categories-routing.module';
import { ForumCategoriesComponent } from './forum-categories.component';
import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@stlmpp/utils';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';
import { ForumCategoriesCategoryComponent } from './forum-categories-category/forum-categories-category.component';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { ListModule } from '@shared/components/list/list.module';
import { AsyncDefaultModule } from '@shared/async-default/async-default.module';
import { ForumFilterDeletedPipe } from './forum-filter-deleted.pipe';
import { ForumCategoriesRecentTopicsComponent } from './forum-categories-recent-topics/forum-categories-recent-topics.component';

@NgModule({
  declarations: [ForumCategoriesComponent, ForumCategoriesCategoryComponent, ForumFilterDeletedPipe, ForumCategoriesRecentTopicsComponent],
  imports: [
    CommonModule,
    ForumCategoriesRoutingModule,
    AccordionModule,
    ButtonModule,
    NgLetModule,
    DragDropModule,
    CheckboxModule,
    AuthSharedModule,
    ListModule,
    AsyncDefaultModule,
  ],
})
export class ForumCategoriesModule {}
