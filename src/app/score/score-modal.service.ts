import { Injectable } from '@angular/core';
import type {
  ScoreApprovalModalComponent,
  ScoreApprovalModalData,
} from './score-shared/score-approval/score-approval-modal/score-approval-modal.component';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalPagination } from '@model/score-approval';
import { ModalService } from '@shared/components/modal/modal.service';
import { ModalConfigLazy } from '@shared/components/modal/modal.config';
import type {
  ScoreRequestChangesModalComponent,
  ScoreRequestChangesModalData,
} from './score-shared/score-approval/score-request-changes-modal/score-request-changes-modal.component';
import type {
  ScoreInfoModalComponent,
  ScoreInfoModalData,
} from './score-shared/score-info/score-info-modal/score-info-modal.component';
import { Score } from '@model/score';

const scoreModalDefaults: ModalConfigLazy = {
  minWidth: '30vw',
  module: () => import('./score-shared/score-shared.module').then(m => m.ScoreSharedModule),
};

@Injectable({ providedIn: 'root' })
export class ScoreModalService {
  constructor(private modalService: ModalService) {}

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

  async openModalScoreInfo(data: ScoreInfoModalData): Promise<ModalRef<ScoreInfoModalComponent, Score>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-info/score-info-modal/score-info-modal.component').then(
          m => m.ScoreInfoModalComponent
        ),
      { data, ...scoreModalDefaults }
    );
  }
}
