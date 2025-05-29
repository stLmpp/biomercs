import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { ScoreApprovalComponent } from '../../score/score-approval/score-approval.component';

@Component({
  selector: 'bio-admin-score-approval',
  templateUrl: './admin-score-approval.component.html',
  styleUrls: ['./admin-score-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTitleComponent, ScoreApprovalComponent],
})
export class AdminScoreApprovalComponent {}
