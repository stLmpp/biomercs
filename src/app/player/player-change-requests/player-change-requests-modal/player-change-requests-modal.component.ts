import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ScoreChangeRequestsPagination, ScoreWithScoreChangeRequests } from '@model/score-change-request';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { Control, ControlArray, ControlGroup, Validators } from '@stlmpp/control';
import { ScoreChangeRequestsFulfilDto } from '@model/score';
import { ScorePlayerUpdateDto } from '@model/score-player';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { IdChecked } from '@shared/type/id-checked';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { scoreCurrencyMask } from '../../../score/score-shared/util';
import { ScoreService } from '../../../score/score.service';
import { finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { trackById } from '@util/track-by';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';

export interface PlayerChangeRequestsModalData {
  score: ScoreWithScoreChangeRequests;
  page?: number;
  itemsPerPage?: number;
}

interface ScoreChangeRequestsFulfilForm extends Omit<ScoreChangeRequestsFulfilDto, 'idsScoreChangeRequests'> {
  idsScoreChangeRequests: IdChecked[];
}

@Component({
  selector: 'bio-player-change-requests-modal',
  templateUrl: './player-change-requests-modal.component.html',
  styleUrls: ['./player-change-requests-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: scoreCurrencyMask }],
})
export class PlayerChangeRequestsModalComponent {
  constructor(
    @Inject(MODAL_DATA) public data: PlayerChangeRequestsModalData,
    public modalRef: ModalRef<
      PlayerChangeRequestsModalComponent,
      PlayerChangeRequestsModalData,
      ScoreChangeRequestsPagination
    >,
    private scoreService: ScoreService,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  loading = false;
  loadingCancelScore = false;
  readonly maskEnum = MaskEnum;
  readonly maskTimePattern = MaskEnumPatterns[MaskEnum.time]!;
  readonly form = new ControlGroup<ScoreChangeRequestsFulfilForm>({
    score: new Control(this.data.score.score, [Validators.required]),
    idsScoreChangeRequests: new ControlArray<IdChecked>(
      this.data.score.scoreChangeRequests.map(
        ({ id }) =>
          new ControlGroup<IdChecked>({
            id: new Control(id),
            checked: new Control(false),
          })
      )
    ),
    scorePlayers: new ControlArray<ScorePlayerUpdateDto>(
      this.data.score.scorePlayers.map(
        scorePlayer =>
          new ControlGroup<ScorePlayerUpdateDto>({
            id: new Control(scorePlayer.id),
            bulletKills: new Control(scorePlayer.bulletKills),
            host: new Control(scorePlayer.host),
            description: new Control(scorePlayer.description, [Validators.required]),
            evidence: new Control(scorePlayer.evidence, [Validators.required, Validators.url]),
          })
      )
    ),
    time: new Control(this.data.score.time, [Validators.required]),
    maxCombo: new Control(this.data.score.maxCombo, [Validators.required, Validators.min(0), Validators.max(400)]),
  });
  readonly scorePlayersControl = this.form.get('scorePlayers');
  readonly noChangeRequestsSelected$ = this.form
    .get('idsScoreChangeRequests')
    .value$.pipe(map(idsScoreChangeRequests => !idsScoreChangeRequests.some(changeRequest => changeRequest.checked)));

  readonly trackById = trackById;

  private _getChangeRequests(): Observable<ScoreChangeRequestsPagination | undefined> {
    if (!this.data.page || !this.data.itemsPerPage) {
      return of(undefined);
    } else {
      return this.scoreService.findChangeRequests(this.data.page, this.data.itemsPerPage);
    }
  }

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
    this.loading = true;
    this.modalRef.disableClose = true;
    this.form.disable();
    const formValue = this.form.value;
    const dto: ScoreChangeRequestsFulfilDto = {
      ...formValue,
      idsScoreChangeRequests: formValue.idsScoreChangeRequests.filter(({ checked }) => checked).map(({ id }) => id),
    };
    this.scoreService
      .fulfilChangeRequests(this.data.score.id, dto)
      .pipe(
        switchMap(() => this._getChangeRequests()),
        finalize(() => {
          this.form.enable();
          this.loading = false;
          this.modalRef.disableClose = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(data => {
        this.modalRef.close(data);
        this.snackBarService.open('Score updated successfully!');
      });
  }

  onCancelScore(): void {
    this.loadingCancelScore = true;
    this.dialogService.confirm({
      title: 'Cancel score?',
      content: `This score will no longer appear in the list of scores, <br> and you won't be able to submit it again for approval`,
      buttons: [
        {
          title: 'Close',
          action: modalRef => {
            this.loadingCancelScore = false;
            this.changeDetectorRef.markForCheck();
            modalRef.close();
          },
        },
        {
          title: 'Cancel Score',
          type: 'danger',
          action: modalRef =>
            this.scoreService.cancel(this.data.score.id).pipe(
              switchMap(() => this._getChangeRequests()),
              tap(data => {
                modalRef.close();
                this.modalRef.close(data);
              }),
              finalize(() => {
                this.loadingCancelScore = false;
                this.changeDetectorRef.markForCheck();
              })
            ),
        },
      ],
    });
  }
}
