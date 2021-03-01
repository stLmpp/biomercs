import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ScoreVW } from '@model/score';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { AbstractScoreService } from '../../../abstract-score.service';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { trackByScorePlayerVW } from '@model/score-player';
import { ScoreApprovalMotiveQuery } from '@shared/services/score-approval-motive/score-approval-motive.query';
import { ScoreApprovalMotiveService } from '@shared/services/score-approval-motive/score-approval-motive.service';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ScoreApprovalMotive, trackByScoreApprovalMotive } from '@model/score-approval-motive';
import { Observable } from 'rxjs';
import { StMapView } from '@stlmpp/store/lib/map';
import { StateComponent } from '@shared/components/common/state-component';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ScoreApprovalAdd, ScoreApprovalVW } from '@model/score-approval';
import { ScoreApprovalComponentState } from '../score-approval.component';

export interface ScoreApprovalModalData {
  score: ScoreVW;
  action: ScoreApprovalActionEnum;
  scoreApprovalComponentState: ScoreApprovalComponentState;
  playerMode: boolean;
}

@Component({
  selector: 'bio-score-approval-modal',
  templateUrl: './score-approval-modal.component.html',
  styleUrls: ['./score-approval-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalModalComponent extends StateComponent<{ saving: boolean }> implements OnInit {
  constructor(
    @Inject(MODAL_DATA) { action, score, scoreApprovalComponentState, playerMode }: ScoreApprovalModalData,
    private scoreService: AbstractScoreService,
    public modalRef: ModalRef<ScoreApprovalModalComponent, ScoreApprovalModalData, ScoreApprovalVW>,
    public scoreApprovalMotiveQuery: ScoreApprovalMotiveQuery,
    private scoreApprovalService: ScoreApprovalMotiveService,
    private controlBuilder: ControlBuilder
  ) {
    super({ saving: false });
    this.score = score;
    this.action = action;
    this.scoreApprovalComponentState = scoreApprovalComponentState;
    this.playerMode = playerMode;
    this.scoreApprovalMotives$ = this.scoreApprovalMotiveQuery.selectByAction(this.action);
  }

  scoreApprovalComponentState: ScoreApprovalComponentState;
  scoreApprovalActionEnum = ScoreApprovalActionEnum;
  score: ScoreVW;
  action: ScoreApprovalActionEnum;
  playerMode: boolean;
  saving$ = this.selectState('saving');
  scoreApprovalMotives$: Observable<StMapView<ScoreApprovalMotive>>;

  form = this.controlBuilder.group<ScoreApprovalAdd>({
    idScoreApprovalMotive: [-1, [Validators.required]],
    description: ['', [Validators.required]],
  });

  trackByScorePlayer = trackByScorePlayerVW;
  trackByScoreApprovalMotive = trackByScoreApprovalMotive;

  save(): void {
    this.updateState({ saving: true });
    this.form.disable();
    const payload = this.form.value;
    this.scoreService
      .approveOrReject(this.playerMode, this.score.idScore, this.action, payload)
      .pipe(
        switchMap(() => {
          const {
            idMiniGame,
            idPlatform,
            idGame,
            idMode,
            itemsPerPage,
            page,
            orderBy,
            orderByDirection,
          } = this.scoreApprovalComponentState;
          return this.scoreService.findApproval(
            this.playerMode,
            idPlatform!,
            page,
            idGame,
            idMiniGame,
            idMode,
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
