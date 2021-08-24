import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ForumComponent],
  imports: [CommonModule, ForumRoutingModule, TitleModule],
})
export class ForumModule {}
