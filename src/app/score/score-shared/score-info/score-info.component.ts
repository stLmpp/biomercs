import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreVW } from '@model/score';
import { trackByScorePlayerVW } from '@model/score-player';
import { BooleanInput } from 'st-utils';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'bio-score-info',
  templateUrl: './score-info.component.html',
  styleUrls: ['./score-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreInfoComponent {
  private _showWorldRecord = false;
  private _showApprovalDate = false;

  @Input() score!: ScoreVW;

  @Input()
  get showWorldRecord(): boolean {
    return this._showWorldRecord;
  }
  set showWorldRecord(showWorldRecord: boolean) {
    this._showWorldRecord = coerceBooleanProperty(showWorldRecord);
  }

  @Input()
  get showApprovalDate(): boolean {
    return this._showApprovalDate;
  }

  set showApprovalDate(showApprovalDate: boolean) {
    this._showApprovalDate = coerceBooleanProperty(showApprovalDate);
  }
  trackByScorePlayer = trackByScorePlayerVW;

  static ngAcceptInputType_showWorldRecord: BooleanInput;
  static ngAcceptInputType_showApprovalDate: BooleanInput;
}
