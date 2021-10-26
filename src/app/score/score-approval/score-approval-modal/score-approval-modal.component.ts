import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { Score } from '@model/score';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalMotiveService } from '@shared/services/score-approval-motive/score-approval-motive.service';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { ScoreApprovalAdd, ScoreApprovalPagination } from '@model/score-approval';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { trackById } from '@util/track-by';
import { ScoreService } from '../../score.service';

export interface ScoreApprovalModalData {
  score: Score;
  action: ScoreApprovalActionEnum;
  scoreApprovalComponentState: ScoreApprovalComponentState;
}

@Component({
  selector: 'bio-score-approval-modal',
  templateUrl: './score-approval-modal.component.html',
  styleUrls: ['./score-approval-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalModalComponent {
  constructor(
    @Inject(MODAL_DATA) { action, score, scoreApprovalComponentState }: ScoreApprovalModalData,
    private scoreService: ScoreService,
    public modalRef: ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalPagination>,
    private scoreApprovalService: ScoreApprovalMotiveService,
    private controlBuilder: ControlBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.score = score;
    this.action = action;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
    this.scoreApprovalMotives$ = this.scoreApprovalService.getByAction(this.action).pipe(
      finalize(() => {
        this.loadingMotives = false;
        this.changeDetectorRef.markForCheck();
      })
    );
  }

  readonly scoreApprovalActionEnum = ScoreApprovalActionEnum;
  saving = false;
  loadingMotives = true;

  readonly scoreApprovalComponentState: ScoreApprovalComponentState;
  readonly score: Score;
  readonly action: ScoreApprovalActionEnum;
  readonly scoreApprovalMotives$: Observable<ScoreApprovalMotive[]>;

  readonly form = this.controlBuilder.group<ScoreApprovalAdd>({
    idScoreApprovalMotive: [-1, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required]],
  });

  readonly trackById = trackById;

  save(): void {
    this.modalRef.disableClose = true;
    this.saving = true;
    this.form.disable();
    const payload = this.form.value;
    this.scoreService
      .approveOrReject(this.score.id, this.action, payload)
      .pipe(
        switchMap(() => {
          const { idMiniGame, idPlatform, idGame, idMode, itemsPerPage, page, orderBy, orderByDirection, idStage } =
            this.scoreApprovalComponentState;
          return this.scoreService.findApproval(
            idPlatform!,
            page,
            idGame,
            idMiniGame,
            idMode,
            idStage,
            itemsPerPage,
            orderBy,
            orderByDirection
          );
        }),
        tap(data => {
          this.modalRef.close(data);
        }),
        finalize(() => {
          this.saving = false;
          this.modalRef.disableClose = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        })
      )
      .subscribe();
  }
}
