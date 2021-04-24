import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ScoreVW } from '@model/score';
import { ColDefInternal } from '@shared/components/table/col-def';
import { ScoreChangeRequests } from '@model/score-change-request';
import { LocalState } from '@stlmpp/store';
import { PlayerService } from '../../player.service';

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
  implements TableCell<ScoreChangeRequests> {
  constructor(private playerService: PlayerService) {
    super({ loadingModal: false });
  }

  @Output() readonly notifyChange = new EventEmitter<any>();

  colDef!: ColDefInternal<ScoreChangeRequests, keyof ScoreChangeRequests>;
  item!: ScoreChangeRequests;
  metadata!: PlayerChangeRequestsActionCellComponentMetadata;

  loadingModal$ = this.selectState('loadingModal');

  async openModalChangeRequests(): Promise<void> {
    this.updateState({ loadingModal: true });
    const { page, itemsPerPage } = this.metadata;
    const modalRef = await this.playerService.openPlayerChangeRequestsModal({ score: this.item, page, itemsPerPage });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.notifyChange.emit(data);
      }
    });
    this.updateState({ loadingModal: false });
  }
}
