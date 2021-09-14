import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumSubCategoryRoutingModule } from './forum-sub-category-routing.module';
import { ForumSubCategoryComponent } from './forum-sub-category.component';

@NgModule({
  declarations: [ForumSubCategoryComponent],
  imports: [CommonModule, ForumSubCategoryRoutingModule],
})
export class ForumSubCategoryModule {}
