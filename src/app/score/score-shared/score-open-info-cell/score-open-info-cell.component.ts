import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ScoreVW } from '@model/score';
import { ScoreService } from '../../score.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bio-score-open-info-cell',
  templateUrl: './score-open-info-cell.component.html',
  styleUrls: ['./score-open-info-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreOpenInfoCellComponent extends TableCell<ScoreVW> {
  constructor(private scoreService: ScoreService) {
    super();
  }

  loading$ = new BehaviorSubject(false);

  async openScoreInfo(): Promise<void> {
    this.loading$.next(true);
    await this.scoreService.openModalScoreInfo({ score: this.item });
    this.loading$.next(false);
  }
}
