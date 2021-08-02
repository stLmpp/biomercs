import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ColDefInternal } from '@shared/components/table/col-def';
import { ScoreWithScoreChangeRequests } from '@model/score-change-request';
import { LocalState } from '@stlmpp/store';
import { PlayerModalService } from '../../player-modal.service';

interface PlayerChangeRequestsActionCellComponentState {
  loadingModal: boolean;
}

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
export class PlayerChangeRequestsActionCellComponent
  extends LocalState<PlayerChangeRequestsActionCellComponentState>
  implements TableCell<ScoreWithScoreChangeRequests>
{
  constructor(private playerModalService: PlayerModalService) {
    super({ loadingModal: false });
  }

  @Output() readonly notifyChange = new EventEmitter<any>();

  colDef!: ColDefInternal<ScoreWithScoreChangeRequests, keyof ScoreWithScoreChangeRequests>;
  item!: ScoreWithScoreChangeRequests;
  metadata!: PlayerChangeRequestsActionCellComponentMetadata;

  readonly loadingModal$ = this.selectState('loadingModal');

  async openModalChangeRequests(): Promise<void> {
    this.updateState({ loadingModal: true });
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
    this.updateState({ loadingModal: false });
  }
}
