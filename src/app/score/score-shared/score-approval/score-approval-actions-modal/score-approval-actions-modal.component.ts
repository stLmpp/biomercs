import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { LocalState } from '@stlmpp/store';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { Score } from '@model/score';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { ScoreService } from '../../../score.service';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalPagination } from '@model/score-approval';

export interface ScoreApprovalActionsModalData {
  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;
}

interface ScoreApprovalActionsComponentState {
  loadingModal: boolean;
}

@Component({
  selector: 'bio-score-approval-actions-modal',
  templateUrl: './score-approval-actions-modal.component.html',
  styleUrls: ['./score-approval-actions-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalActionsModalComponent extends LocalState<ScoreApprovalActionsComponentState> {
  constructor(
    @Inject(MODAL_DATA) { score, scoreApprovalComponentState }: ScoreApprovalActionsModalData,
    private scoreService: ScoreService,
    private modalRef: ModalRef<
      ScoreApprovalActionsModalComponent,
      ScoreApprovalActionsModalData,
      ScoreApprovalPagination | null
    >
  ) {
    super({ loadingModal: false });
    this.score = score;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
  }

  score: Score;
  scoreApprovalComponentState: ScoreApprovalComponentState;

  scoreApprovalActionEnum = ScoreApprovalActionEnum;

  loading$ = this.selectState('loadingModal');

  async openModalApproval(action: ScoreApprovalActionEnum): Promise<void> {
    this.updateState({ loadingModal: true });
    const modalRef = await this.scoreService.openModalScoreApproval({
      score: this.score,
      action,
      scoreApprovalComponentState: this.scoreApprovalComponentState,
      playerMode: this.scoreApprovalComponentState.playerMode,
    });
    modalRef.onClose$.subscribe(data => {
      this.modalRef.close(data);
    });
    this.updateState({ loadingModal: false });
  }

  async openModalRequestChanges(): Promise<void> {
    if (this.scoreApprovalComponentState.playerMode) {
      return;
    }
    this.updateState({ loadingModal: true });
    const modalRef = await this.scoreService.openModalRequestChangesScore({
      score: this.score,
      scoreApprovalComponentState: this.scoreApprovalComponentState,
    });
    modalRef.onClose$.subscribe(data => {
      this.modalRef.close(data);
    });
    this.updateState({ loadingModal: false });
  }
}
