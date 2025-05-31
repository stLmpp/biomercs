import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreInfoComponent } from '../score-info.component';
import { Score } from '@model/score';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalContentDirective } from '../../../shared/components/modal/modal-content.directive';
import { ModalActionsDirective } from '../../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../../shared/components/button/button.component';

export interface ScoreInfoModalData {
  score: Score;
  showWorldRecord?: boolean;
  showApprovalDate?: boolean;
}

@Component({
  selector: 'bio-score-info-modal',
  templateUrl: './score-info-modal.component.html',
  styleUrls: ['./score-info-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalContentDirective, ScoreInfoComponent, ModalActionsDirective, ButtonComponent],
})
export class ScoreInfoModalComponent {
  modalRef = inject<ModalRef<ScoreInfoComponent, ScoreInfoModalData>>(ModalRef);

  constructor() {
    const { score, showWorldRecord, showApprovalDate } = inject<ScoreInfoModalData>(MODAL_DATA);
    this.score = score;
    this.showWorldRecord = showWorldRecord ?? false;
    this.showApprovalDate = showApprovalDate ?? false;
  }

  score: Score;
  showWorldRecord: boolean;
  showApprovalDate: boolean;
}
