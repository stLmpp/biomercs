import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumSubCategoryRoutingModule } from './forum-sub-category-routing.module';
import { ForumSubCategoryComponent } from './forum-sub-category.component';
import { ListModule } from '@shared/components/list/list.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ForumSubCategoryTopicComponent } from './forum-sub-category-topic/forum-sub-category-topic.component';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';

@NgModule({
  declarations: [ForumSubCategoryComponent, ForumSubCategoryTopicComponent],
  imports: [
    CommonModule,
    ForumSubCategoryRoutingModule,
    ListModule,
    IconModule,
    CardModule,
    PaginationModule,
    AuthSharedModule,
  ],
})
export class ForumSubCategoryModule {}
