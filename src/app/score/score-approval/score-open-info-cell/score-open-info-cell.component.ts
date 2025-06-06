import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { Score } from '@model/score';
import { BehaviorSubject } from 'rxjs';
import { ScoreInfoModalData } from '../../score-info/score-info-modal/score-info-modal.component';
import { ScoreModalService } from '../../score-modal.service';

@Component({
  selector: 'bio-score-open-info-cell',
  templateUrl: './score-open-info-cell.component.html',
  styleUrls: ['./score-open-info-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreOpenInfoCellComponent extends TableCell<Score> {
  constructor(private scoreModalService: ScoreModalService) {
    super();
  }

  readonly loading$ = new BehaviorSubject(false);

  async openScoreInfo(): Promise<void> {
    this.loading$.next(true);
    const data: ScoreInfoModalData = { score: this.item, showWorldRecord: false, showApprovalDate: false };
    const metadata = this.colDef.metadata;
    if (metadata?.showWorldRecord) {
      data.showWorldRecord = metadata.showWorldRecord;
    }
    if (metadata?.showApprovalDate) {
      data.showApprovalDate = metadata.showApprovalDate;
    }
    await this.scoreModalService.openModalScoreInfo(data);
    this.loading$.next(false);
  }
}
