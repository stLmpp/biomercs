import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreInfoComponent } from '../score-info.component';
import { ScoreVW } from '@model/score';
import { MODAL_DATA } from '@shared/components/modal/modal.config';

export interface ScoreInfoModalData {
  score: ScoreVW;
  showWorldRecord?: boolean;
  showApprovalDate?: boolean;
}

@Component({
  selector: 'bio-score-info-modal',
  templateUrl: './score-info-modal.component.html',
  styleUrls: ['./score-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreInfoModalComponent {
  constructor(
    @Inject(MODAL_DATA) { score, showWorldRecord, showApprovalDate }: ScoreInfoModalData,
    public modalRef: ModalRef<ScoreInfoComponent, ScoreVW>
  ) {
    this.score = score;
    this.showWorldRecord = showWorldRecord ?? false;
    this.showApprovalDate = showApprovalDate ?? false;
  }

  score: ScoreVW;
  showWorldRecord: boolean;
  showApprovalDate: boolean;
}
