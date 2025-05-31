import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { Score } from '@model/score';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalPagination } from '@model/score-approval';
import { ScoreModalService } from '../../score-modal.service';
import { ModalContentDirective } from '../../../shared/components/modal/modal-content.directive';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';

export interface ScoreApprovalActionsModalData {
  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;
}

@Component({
  selector: 'bio-score-approval-actions-modal',
  templateUrl: './score-approval-actions-modal.component.html',
  styleUrls: ['./score-approval-actions-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalContentDirective, ButtonComponent, TooltipDirective, IconComponent],
})
export class ScoreApprovalActionsModalComponent {
  private modalRef =
    inject<ModalRef<ScoreApprovalActionsModalComponent, ScoreApprovalActionsModalData, ScoreApprovalPagination | null>>(
      ModalRef
    );
  private scoreModalService = inject(ScoreModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    const { score, scoreApprovalComponentState } = inject<ScoreApprovalActionsModalData>(MODAL_DATA);
    this.score = score;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
  }

  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;

  readonly scoreApprovalActionEnum = ScoreApprovalActionEnum;

  loading = false;

  async openModalApproval(action: ScoreApprovalActionEnum): Promise<void> {
    this.loading = true;
    const modalRef = await this.scoreModalService.openModalScoreApproval({
      score: this.score,
      action,
      scoreApprovalComponentState: this.scoreApprovalComponentState,
    });
    modalRef.onClose$.subscribe(data => {
      this.modalRef.close(data);
    });
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }

  async openModalRequestChanges(): Promise<void> {
    this.loading = true;
    const modalRef = await this.scoreModalService.openModalRequestChangesScore({
      score: this.score,
      scoreApprovalComponentState: this.scoreApprovalComponentState,
    });
    modalRef.onClose$.subscribe(data => {
      this.modalRef.close(data);
    });
    this.loading = false;
    this.changeDetectorRef.markForCheck();
  }
}
