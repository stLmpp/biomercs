import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerStore } from './player.store';
import { Player } from '@model/player';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  PlayerChangeRequestsModalComponent,
  PlayerChangeRequestsModalData,
} from './player-change-requests/player-change-requests-modal/player-change-requests-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { ScoreChangeRequestsPagination } from '@model/score-change-request';
import { AbstractPlayerService } from './abstract-player.service';
import type {
  PlayerSearchModalComponent,
  PlayerSearchModalComponentData,
} from './player-shared/player-search-modal/player-search-modal.component';
import { ModalConfigLazy } from '@shared/components/modal/modal.config';
import { WINDOW } from '../core/window.service';
import { SteamService } from '@shared/services/steam/steam.service';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';

@Injectable({ providedIn: 'root' })
export class PlayerService extends AbstractPlayerService {
  constructor(
    http: HttpClient,
    playerStore: PlayerStore,
    @Inject(WINDOW) window: Window,
    steamService: SteamService,
    dialogService: DialogService,
    private modalService: ModalService
  ) {
    super(http, playerStore, window, steamService, dialogService);
  }

  async openPlayerChangeRequestsModal(
    data: PlayerChangeRequestsModalData
  ): Promise<
    ModalRef<PlayerChangeRequestsModalComponent, PlayerChangeRequestsModalData, ScoreChangeRequestsPagination>
  > {
    return this.modalService.openLazy(
      () =>
        import('./player-change-requests/player-change-requests-modal/player-change-requests-modal.component').then(
          m => m.PlayerChangeRequestsModalComponent
        ),
      { data, disableClose: true, minWidth: '60vw' }
    );
  }

  async openPlayerSearchModal(
    data: PlayerSearchModalComponentData,
    modalConfig?: ModalConfigLazy
  ): Promise<ModalRef<PlayerSearchModalComponent, PlayerSearchModalComponentData, Player | undefined>> {
    return this.modalService.openLazy(
      () =>
        import('./player-shared/player-search-modal/player-search-modal.component').then(
          m => m.PlayerSearchModalComponent
        ),
      {
        ...modalConfig,
        data,
        disableClose: true,
        module: () => import('./player-shared/player-shared.module').then(m => m.PlayerSharedModule),
        panelClass: 'player-search-modal',
      }
    );
  }
}
