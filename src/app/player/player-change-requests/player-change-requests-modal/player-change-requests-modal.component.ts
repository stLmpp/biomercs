import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ScoreChangeRequests, trackByScoreChangeRequest } from '@model/score-change-request';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { Control, ControlArray, ControlGroup, Validators } from '@stlmpp/control';
import { ScoreChangeRequestsFulfilDto } from '@model/score';
import { ScorePlayerUpdateDto, trackByScorePlayerVW } from '@model/score-player';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { IdChecked } from '@shared/type/id-checked';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { scoreCurrencyMask } from '../../../score/score-shared/util';
import { ScoreService } from '../../../score/score.service';
import { finalize, switchMapTo } from 'rxjs/operators';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { LocalState } from '@stlmpp/store';

export interface PlayerChangeRequestsModalData {
  score: ScoreChangeRequests;
  page: number;
  itemsPerPage: number;
}

interface ScoreChangeRequestsFulfilForm extends Omit<ScoreChangeRequestsFulfilDto, 'idsScoreChangeRequests'> {
  idsScoreChangeRequests: IdChecked[];
}

interface PlayerChangeRequestsModalState {
  loading: boolean;
}

@Component({
  selector: 'bio-player-change-requests-modal',
  templateUrl: './player-change-requests-modal.component.html',
  styleUrls: ['./player-change-requests-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: scoreCurrencyMask,
    },
  ],
})
export class PlayerChangeRequestsModalComponent extends LocalState<PlayerChangeRequestsModalState> {
  constructor(
    @Inject(MODAL_DATA) public data: PlayerChangeRequestsModalData,
    public modalRef: ModalRef<PlayerChangeRequestsModalComponent, PlayerChangeRequestsModalData>,
    private scoreService: ScoreService,
    private snackBarService: SnackBarService
  ) {
    super({ loading: false });
    (window as any).c = this;
  }

  loading$ = this.selectState('loading');

  maskEnum = MaskEnum;
  maskTimePattern = MaskEnumPatterns[MaskEnum.time]!;

  form = new ControlGroup<ScoreChangeRequestsFulfilForm>({
    score: new Control(this.data.score.score, [Validators.required]),
    idsScoreChangeRequests: new ControlArray(
      this.data.score.scoreChangeRequests.map(
        ({ idScoreChangeRequest }) =>
          new ControlGroup({
            id: new Control(idScoreChangeRequest),
            checked: new Control(false),
          })
      )
    ),
    scorePlayers: new ControlArray(
      this.data.score.scorePlayers.map(
        scorePlayer =>
          new ControlGroup({
            id: new Control(scorePlayer.idScorePlayer),
            bulletKills: new Control(scorePlayer.bulletKills, [Validators.required, Validators.min(0)]),
            host: new Control(scorePlayer.host),
            description: new Control(scorePlayer.description, [Validators.required]),
            evidence: new Control(scorePlayer.evidence, [Validators.required, Validators.url]),
          })
      )
    ),
    time: new Control(this.data.score.time, [Validators.required]),
    maxCombo: new Control(this.data.score.maxCombo, [Validators.required, Validators.min(0), Validators.max(400)]),
  });

  get scorePlayersControl(): ControlArray<ScorePlayerUpdateDto> {
    return this.form.get('scorePlayers');
  }

  trackByScoreChangeRequest = trackByScoreChangeRequest;
  trackByScorePlayer = trackByScorePlayerVW;

  hostChange($index: number): void {
    const scorePlayersControl = this.form.get('scorePlayers');
    for (let i = 0; i < scorePlayersControl.length; i++) {
      if ($index !== i) {
        scorePlayersControl.get(i)?.get('host')?.setValue(false);
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.updateState({ loading: true });
    this.form.disable();
    const formValue = this.form.value;
    const dto: ScoreChangeRequestsFulfilDto = {
      ...formValue,
      idsScoreChangeRequests: formValue.idsScoreChangeRequests.filter(({ checked }) => checked).map(({ id }) => id),
    };
    this.scoreService
      .fulfilChangeRequests(this.data.score.idScore, dto)
      .pipe(
        switchMapTo(this.scoreService.findChangeRequests(this.data.page, this.data.itemsPerPage)),
        finalize(() => {
          this.form.enable();
          this.updateState({ loading: false });
        })
      )
      .subscribe(data => {
        this.modalRef.close(data);
        this.snackBarService.open('Score updated successfully!');
      });
  }
}
