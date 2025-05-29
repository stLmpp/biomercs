import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { Score } from '@model/score';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ColDefInternal } from '@shared/components/table/col-def';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { ScoreApprovalPagination } from '@model/score-approval';
import { ScoreModalService } from '../../score-modal.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'bio-score-approval-actions-cell',
  templateUrl: './score-approval-actions-cell.component.html',
  styleUrls: ['./score-approval-actions-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, TooltipDirective, IconComponent],
})
export class ScoreApprovalActionsCellComponent implements TableCell<Score> {
  constructor(private scoreModalService: ScoreModalService, private changeDetectorRef: ChangeDetectorRef) {}

  @Output() readonly notifyChange = new EventEmitter<ScoreApprovalPagination>();

  colDef!: ColDefInternal<Score, keyof Score>;
  item!: Score;
  metadata!: ScoreApprovalComponentState;
  readonly scoreApprovalActionEnum = ScoreApprovalActionEnum;

  loadingApprovalModal = false;
  loadingRequestChangesModal = false;

  async openModalApproval(action: ScoreApprovalActionEnum): Promise<void> {
    this.loadingApprovalModal = true;
    const modalRef = await this.scoreModalService.openModalScoreApproval({
      score: this.item,
      action,
      scoreApprovalComponentState: this.metadata,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.loadingApprovalModal = false;
    this.changeDetectorRef.markForCheck();
  }

  async openModalRequestChanges(): Promise<void> {
    this.loadingRequestChangesModal = true;
    const modalRef = await this.scoreModalService.openModalRequestChangesScore({
      score: this.item,
      scoreApprovalComponentState: this.metadata,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.loadingRequestChangesModal = false;
    this.changeDetectorRef.markForCheck();
  }
}
