import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ScoreVW } from '@model/score';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ColDefInternal } from '@shared/components/table/col-def';
import { LocalState } from '@stlmpp/store';
import { ScoreService } from '../../../score.service';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { ScoreApprovalVW } from '@model/score-approval';

interface ScoreApprovalActionsCellState {
  loadingApprovalModal: boolean;
  loadingRequestChangesModal: boolean;
}

@Component({
  selector: 'bio-score-approval-actions-cell',
  templateUrl: './score-approval-actions-cell.component.html',
  styleUrls: ['./score-approval-actions-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalActionsCellComponent
  extends LocalState<ScoreApprovalActionsCellState>
  implements TableCell<ScoreVW> {
  constructor(private scoreService: ScoreService) {
    super({ loadingApprovalModal: false, loadingRequestChangesModal: false });
  }

  @Output() readonly notifyChange = new EventEmitter<ScoreApprovalVW>();

  colDef!: ColDefInternal<ScoreVW, keyof ScoreVW>;
  item!: ScoreVW;
  metadata!: ScoreApprovalComponentState;
  scoreApprovalActionEnum = ScoreApprovalActionEnum;

  state$ = this.selectState();

  async openModalApproval(action: ScoreApprovalActionEnum): Promise<void> {
    this.updateState({ loadingApprovalModal: true });
    const modalRef = await this.scoreService.openModalScoreApproval({
      score: this.item,
      action,
      scoreApprovalComponentState: this.metadata,
      playerMode: this.metadata.playerMode,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.updateState({ loadingApprovalModal: false });
  }

  async openModalRequestChanges(): Promise<void> {
    if (this.metadata.playerMode) {
      return;
    }
    this.updateState({ loadingRequestChangesModal: true });
    const modalRef = await this.scoreService.openModalRequestChangesScore({
      score: this.item,
      scoreApprovalComponentState: this.metadata,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.updateState({ loadingRequestChangesModal: false });
  }
}
