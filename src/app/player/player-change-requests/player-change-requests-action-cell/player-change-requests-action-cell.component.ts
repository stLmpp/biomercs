import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ColDefInternal } from '@shared/components/table/col-def';
import { ScoreWithScoreChangeRequests } from '@model/score-change-request';
import { PlayerModalService } from '../../player-modal.service';

export interface PlayerChangeRequestsActionCellComponentMetadata {
  page: number;
  itemsPerPage: number;
}

@Component({
  selector: 'bio-player-change-requests-action-cell',
  templateUrl: './player-change-requests-action-cell.component.html',
  styleUrls: ['./player-change-requests-action-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerChangeRequestsActionCellComponent implements TableCell<ScoreWithScoreChangeRequests> {
  constructor(private playerModalService: PlayerModalService, private changeDetectorRef: ChangeDetectorRef) {}

  @Output() readonly notifyChange = new EventEmitter<any>();

  colDef!: ColDefInternal<ScoreWithScoreChangeRequests, keyof ScoreWithScoreChangeRequests>;
  item!: ScoreWithScoreChangeRequests;
  metadata!: PlayerChangeRequestsActionCellComponentMetadata;

  loadingModal = false;

  async openModalChangeRequests(): Promise<void> {
    this.loadingModal = true;
    const { page, itemsPerPage } = this.metadata;
    const modalRef = await this.playerModalService.openPlayerChangeRequestsModal({
      score: this.item,
      page,
      itemsPerPage,
    });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.loadingModal = false;
    this.changeDetectorRef.markForCheck();
  }
}
