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

@NgModule({
  declarations: [ForumCategoriesComponent],
  imports: [
    CommonModule,
    ForumCategoriesRoutingModule,
    AccordionModule,
    ButtonModule,
    NgLetModule,
    DragDropModule,
    CheckboxModule,
    ArrayPipesModule,
  ],
})
export class ForumCategoriesModule {}
