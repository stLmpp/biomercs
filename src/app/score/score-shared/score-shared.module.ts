import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreApprovalComponent } from './score-approval/score-approval.component';
import { ParamsModule } from '@shared/params/params.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { CardModule } from '@shared/components/card/card.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { ArrayModule } from '@shared/array/array.module';

@NgModule({
  declarations: [ScoreApprovalComponent],
  imports: [CommonModule, ParamsModule, PaginationModule, CardModule, NgLetModule, SpinnerModule, ArrayModule],
  exports: [ScoreApprovalComponent],
})
export class ScoreSharedModule {}
