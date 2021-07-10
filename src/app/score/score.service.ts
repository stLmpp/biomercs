import { Injectable } from '@angular/core';
import { AbstractScoreService } from './abstract-score.service';
import type { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ScoreApprovalModalComponent,
  ScoreApprovalModalData,
} from './score-shared/score-approval/score-approval-modal/score-approval-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import type { ScoreApprovalPagination } from '@model/score-approval';
import type { Score } from '@model/score';
import type {
  ScoreInfoModalComponent,
  ScoreInfoModalData,
} from './score-shared/score-info/score-info-modal/score-info-modal.component';
import type {
  ScoreRequestChangesModalComponent,
  ScoreRequestChangesModalData,
} from './score-shared/score-approval/score-request-changes-modal/score-request-changes-modal.component';
import { HeaderStore } from '../header/header.store';
import type { ModalConfigLazy } from '@shared/components/modal/modal.config';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';

const scoreModalDefaults: ModalConfigLazy = {
  minWidth: '30vw',
  module: () => import('./score-shared/score-shared.module').then(m => m.ScoreSharedModule),
  disableClose: true,
};

@Injectable({ providedIn: 'root' })
export class ScoreService extends AbstractScoreService {
  constructor(
    http: HttpClient,
    headerStore: HeaderStore,
    socketIOService: SocketIOService,
    private modalService: ModalService
  ) {
    super(http, headerStore, socketIOService);
  }

  async openModalScoreApproval(
    data: ScoreApprovalModalData
  ): Promise<ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalPagination>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-approval/score-approval-modal/score-approval-modal.component').then(
          m => m.ScoreApprovalModalComponent
        ),
      { data, ...scoreModalDefaults }
    );
  }

  async openModalScoreInfo(data: ScoreInfoModalData): Promise<ModalRef<ScoreInfoModalComponent, Score>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-info/score-info-modal/score-info-modal.component').then(
          m => m.ScoreInfoModalComponent
        ),
      { data, ...scoreModalDefaults }
    );
  }

  async openModalRequestChangesScore(
    data: ScoreRequestChangesModalData
  ): Promise<ModalRef<ScoreRequestChangesModalComponent, ScoreRequestChangesModalData, ScoreApprovalPagination>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-approval/score-request-changes-modal/score-request-changes-modal.component').then(
          m => m.ScoreRequestChangesModalComponent
        ),
      { data, ...scoreModalDefaults }
    );
  }
}
