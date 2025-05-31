import { Injectable, inject } from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';
import type {
  PlayerChangeRequestsModalComponent,
  PlayerChangeRequestsModalData,
} from './player-change-requests/player-change-requests-modal/player-change-requests-modal.component';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreChangeRequestsPagination } from '@model/score-change-request';
import type {
  PlayerSearchModalComponent,
  PlayerSearchModalComponentData,
} from './player-shared/player-search-modal/player-search-modal.component';
import { ModalConfigLazy } from '@shared/components/modal/modal.config';
import { Player } from '@model/player';

@Injectable({ providedIn: 'root' })
export class PlayerModalService {
  private modalService = inject(ModalService);

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
      { data, minWidth: '60vw' }
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
        module: () => import('./player-shared/player-shared.module').then(m => m.PlayerSharedModule),
        panelClass: 'player-search-modal',
      }
    );
  }
}
