import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { TableCell } from '@shared/components/table/type';
import { ColDefInternal } from '@shared/components/table/col-def';
import { ScoreWithScoreChangeRequests } from '@model/score-change-request';
import { PlayerModalService } from '../../player-modal.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';

export interface PlayerChangeRequestsActionCellComponentMetadata {
  page: number;
  itemsPerPage: number;
}

@Component({
  selector: 'bio-player-change-requests-action-cell',
  templateUrl: './player-change-requests-action-cell.component.html',
  styleUrls: ['./player-change-requests-action-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, TooltipDirective, IconComponent],
})
export class PlayerChangeRequestsActionCellComponent implements TableCell<ScoreWithScoreChangeRequests> {
  private playerModalService = inject(PlayerModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly notifyChange = output<any>();

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
