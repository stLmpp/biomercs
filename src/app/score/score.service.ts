import { Injectable } from '@angular/core';
import { AbstractScoreService } from './abstract-score.service';
import type { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ScoreApprovalModalComponent,
  ScoreApprovalModalData,
} from './score-shared/score-approval/score-approval-modal/score-approval-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import type { ScoreApprovalVW } from '@model/score-approval';
import type { ScoreVW } from '@model/score';
import type {
  ScoreInfoModalComponent,
  ScoreInfoModalData,
} from './score-shared/score-info/score-info-modal/score-info-modal.component';

@Injectable({ providedIn: 'root' })
export class ScoreService extends AbstractScoreService {
  constructor(http: HttpClient, private modalService: ModalService) {
    super(http);
  }

  async openModalScoreApproval(
    data: ScoreApprovalModalData
  ): Promise<ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalVW>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-approval/score-approval-modal/score-approval-modal.component').then(
          m => m.ScoreApprovalModalComponent
        ),
      { data, minWidth: '30vw' }
    );
  }

  async openModalScoreInfo(data: ScoreInfoModalData): Promise<ModalRef<ScoreInfoModalComponent, ScoreVW>> {
    return this.modalService.openLazy(
      () =>
        import('./score-shared/score-info/score-info-modal/score-info-modal.component').then(
          m => m.ScoreInfoModalComponent
        ),
      { data, minWidth: '30vw' }
    );
  }
}
