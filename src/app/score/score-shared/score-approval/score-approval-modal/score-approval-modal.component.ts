import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Score } from '@model/score';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { ScoreApprovalMotiveQuery } from '@shared/services/score-approval-motive/score-approval-motive.query';
import { ScoreApprovalMotiveService } from '@shared/services/score-approval-motive/score-approval-motive.service';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { finalize, Observable, switchMap, tap } from 'rxjs';
import { LocalState, StMapView } from '@stlmpp/store';
import { ScoreApprovalAdd, ScoreApprovalPagination } from '@model/score-approval';
import { ScoreApprovalComponentState } from '../score-approval.component';
import { trackById } from '@util/track-by';
import { ScoreService } from '../../../score.service';

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
export class ScoreApprovalModalComponent extends LocalState<{ saving: boolean }> implements OnInit {
  constructor(
    @Inject(MODAL_DATA) { action, score, scoreApprovalComponentState }: ScoreApprovalModalData,
    private scoreService: ScoreService,
    public modalRef: ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalPagination>,
    public scoreApprovalMotiveQuery: ScoreApprovalMotiveQuery,
    private scoreApprovalService: ScoreApprovalMotiveService,
    private controlBuilder: ControlBuilder
  ) {
    super({ saving: false });
    this.score = score;
    this.action = action;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
    this.scoreApprovalMotives$ = this.scoreApprovalMotiveQuery.selectByAction(this.action);
  }

  readonly scoreApprovalActionEnum = ScoreApprovalActionEnum;
  readonly saving$ = this.selectState('saving');

  scoreApprovalComponentState: ScoreApprovalComponentState;
  score: Score;
  action: ScoreApprovalActionEnum;
  scoreApprovalMotives$: Observable<StMapView<ScoreApprovalMotive>>;

  readonly form = this.controlBuilder.group<ScoreApprovalAdd>({
    idScoreApprovalMotive: [-1, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required]],
  });

  readonly trackById = trackById;

  save(): void {
    this.updateState({ saving: true });
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
          this.updateState({ saving: false });
          this.form.enable();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.scoreApprovalService.getByAction(this.action).subscribe();
  }
}
