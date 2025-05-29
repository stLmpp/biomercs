import { Injectable, inject } from '@angular/core';
import type {
  ScoreApprovalModalComponent,
  ScoreApprovalModalData,
} from './score-approval/score-approval-modal/score-approval-modal.component';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalPagination } from '@model/score-approval';
import { ModalService } from '@shared/components/modal/modal.service';
import type {
  ScoreRequestChangesModalComponent,
  ScoreRequestChangesModalData,
} from './score-request-changes-modal/score-request-changes-modal.component';
import type {
  ScoreInfoModalComponent,
  ScoreInfoModalData,
} from './score-info/score-info-modal/score-info-modal.component';

@Injectable({ providedIn: 'root' })
export class ScoreModalService {
  private modalService = inject(ModalService);


  async openModalScoreApproval(
    data: ScoreApprovalModalData
  ): Promise<ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalPagination>> {
    return this.modalService.openLazy(
      () =>
        import('./score-approval/score-approval-modal/score-approval-modal.component').then(
          m => m.ScoreApprovalModalComponent
        ),
      {
        data,
        minWidth: '30vw',
        module: () => import('./score-approval/score-approval.module').then(m => m.ScoreApprovalModule),
      }
    );
  }

  async openModalRequestChangesScore(
    data: ScoreRequestChangesModalData
  ): Promise<ModalRef<ScoreRequestChangesModalComponent, ScoreRequestChangesModalData, ScoreApprovalPagination>> {
    return this.modalService.openLazy(
      () =>
        import('./score-request-changes-modal/score-request-changes-modal.component').then(
          m => m.ScoreRequestChangesModalComponent
        ),
      {
        data,
        minWidth: '30vw',
        module: () =>
          import('./score-request-changes-modal/score-request-changes-modal.module').then(
            m => m.ScoreRequestChangesModalModule
          ),
      }
    );
  }

  async openModalScoreInfo(data: ScoreInfoModalData): Promise<ModalRef<ScoreInfoModalComponent, ScoreInfoModalData>> {
    return this.modalService.openLazy(
      () => import('./score-info/score-info-modal/score-info-modal.component').then(m => m.ScoreInfoModalComponent),
      {
        data,
        minWidth: '30vw',
        module: () => import('./score-info/score-info.module').then(m => m.ScoreInfoModule),
      }
    );
  }
}
