import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScoreVW } from '@model/score';
import { trackByScorePlayerVW } from '@model/score-player';

@Component({
  selector: 'bio-score-info',
  templateUrl: './score-info.component.html',
  styleUrls: ['./score-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreInfoComponent {
  @Input() score!: ScoreVW;
  trackByScorePlayer = trackByScorePlayerVW;
}
