import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import { ForumComponent } from './forum.component';

@NgModule({
  imports: [CommonModule, ForumRoutingModule, ForumComponent],
})
export class ForumModule {}
