import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Score } from '@model/score';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { mdiAccountStar, mdiTrophy, mdiTrophyAward } from '@mdi/js';
import { trackByFactory } from '@stlmpp/utils';
import { ScorePlayer } from '@model/score-player';

@Component({
  selector: 'bio-score-info',
  templateUrl: './score-info.component.html',
  styleUrls: ['./score-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreInfoComponent {
  private _showWorldRecord = false;
  private _showApprovalDate = false;

  @Input() score!: Score;

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

  readonly mdiTrophy = mdiTrophy;
  readonly mdiTrophyAward = mdiTrophyAward;
  readonly mdiAccountStar = mdiAccountStar;

  readonly trackByScorePlayer = trackByFactory<ScorePlayer>('id');

  static ngAcceptInputType_showWorldRecord: BooleanInput;
  static ngAcceptInputType_showApprovalDate: BooleanInput;
}
