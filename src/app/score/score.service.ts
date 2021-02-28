import { Injectable } from '@angular/core';
import { AbstractScoreService } from './abstract-score.service';
import type { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  ScoreApprovalModalComponent,
  ScoreApprovalModalData,
} from './score-shared/score-approval/score-approval-modal/score-approval-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalVW } from '@model/score-approval';

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
      {
        data,
      }
    );
  }
}
