import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreVW, trackByScoreVW } from '@model/score';
import { trackByScorePlayerVW } from '@model/score-player';
import { BooleanInput } from '@angular/cdk/coercion';

@Component({
  selector: 'bio-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreListComponent {
  constructor() {}

  @Input() scores: ScoreVW[] = [];
  @Input() loading: BooleanInput = false;

  trackByScoreVW = trackByScoreVW;
  trackByScorePlayerVW = trackByScorePlayerVW;
}
