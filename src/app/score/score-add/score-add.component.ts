import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ControlArray, ControlBuilder, ControlGroup, Validators } from '@stlmpp/control';
import { AuthQuery } from '../../auth/auth.query';
import { ParamsComponent, ParamsConfig } from '@shared/params/params.component';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { combineLatest, distinctUntilChanged, finalize, map, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { CharacterCostume } from '@model/character-costume';
import { filterNil } from '@shared/operators/filter';
import { CharacterService } from '@shared/services/character/character.service';
import { ModeQuery } from '@shared/services/mode/mode.query';
import { ScoreAddPlayerComponent } from './score-add-player/score-add-player.component';
import { generateScorePlayerControlGroup, ScoreAddForm, ScorePlayerAddForm } from './score-add';
import { ScoreService } from '../score.service';
import { ScoreAdd } from '@model/score';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { Mode } from '@model/mode';
import { scoreCurrencyMask } from '../score-shared/util';
import { LocalState } from '@stlmpp/store';
import { Router } from '@angular/router';
import { filterNilArrayOperator } from '@util/operators/filter-nil-array';
import { trackByControl } from '@util/track-by';

export interface ScoreAddState {
  characterLoading: boolean;
  submitting: boolean;
  submitModalLoading: boolean;
}

@Component({
  selector: 'bio-score-add',
  templateUrl: './score-add.component.html',
  styleUrls: ['./score-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: scoreCurrencyMask }],
})
export class ScoreAddComponent extends LocalState<ScoreAddState> implements OnInit {
  constructor(
    private controlBuilder: ControlBuilder,
    private authQuery: AuthQuery,
    private characterService: CharacterService,
    private modeQuery: ModeQuery,
    private scoreService: ScoreService,
    private dialogService: DialogService,
    private router: Router
  ) {
    super({ characterLoading: false, submitting: false, submitModalLoading: false });
  }

  @ViewChildren(ScoreAddPlayerComponent) scoreAddPlayerComponents!: QueryList<ScoreAddPlayerComponent>;
  @ViewChild(ParamsComponent) paramsComponent!: ParamsComponent;

  readonly maskEnum = MaskEnum;
  readonly maskTimePattern = MaskEnumPatterns[MaskEnum.time]!;

  readonly paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
    idGame: { show: true, validators: [Validators.required], errorMessages: { required: 'Game is required' } },
    idMiniGame: { show: true, validators: [Validators.required], errorMessages: { required: 'Mini Game is required' } },
    idMode: { show: true, validators: [Validators.required], errorMessages: { required: 'Mode is required' } },
    idPlatform: { show: true, validators: [Validators.required], errorMessages: { required: 'Platform is required' } },
    idStage: { show: true, validators: [Validators.required], errorMessages: { required: 'Stage is required' } },
  };

  readonly form = this.controlBuilder.group<ScoreAddForm>({
    idGame: [null, [Validators.required]],
    idMiniGame: [null, [Validators.required]],
    idMode: [null, [Validators.required]],
    idPlatform: [null, [Validators.required]],
    idStage: [null, [Validators.required]],
    score: [0, [Validators.required]],
    maxCombo: [0, [Validators.required, Validators.min(0), Validators.max(400)]],
    time: [`00'00"00`, [Validators.required]],
    scorePlayers: this.controlBuilder.array<ScorePlayerAddForm>([
      {
        bulletKills: [0],
        description: ['', [Validators.required]],
        host: [true],
        // No need to worry here, since it's only possible to access this route with auth and the resolver of the player
        idPlayer: [this.authQuery.getUser()!.player!.id, [Validators.required]],
        personaName: [this.authQuery.getUser()!.player!.personaName],
        evidence: ['', [Validators.required, Validators.url]],
        idCharacterCostume: [null, [Validators.required]],
      },
    ]),
  });

  readonly idPlatform$ = this.form.get('idPlatform').value$.pipe(distinctUntilChanged());
  readonly idGame$ = this.form.get('idGame').value$.pipe(distinctUntilChanged());
  readonly idMiniGame$ = this.form.get('idMiniGame').value$.pipe(distinctUntilChanged());
  readonly idMode$ = this.form.get('idMode').value$.pipe(distinctUntilChanged());
  readonly characterLoading$ = this.selectState('characterLoading');
  readonly submitModalLoading$ = this.selectState('submitModalLoading');

  readonly hasIdMode$ = this.form.get('idMode').value$.pipe(map(idMode => !!idMode));

  readonly characters$ = combineLatest([this.idPlatform$, this.idGame$, this.idMiniGame$, this.idMode$]).pipe(
    filterNilArrayOperator(),
    switchMap(([idPlatform, idGame, idMiniGame, idMode]) => {
      this.updateState('characterLoading', true);
      return this.characterService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode).pipe(
        finalize(() => {
          this.updateState('characterLoading', false);
        }),
        tap(characters => {
          const characterCostumes = characters.reduce(
            (acc, character) => [...acc, ...character.characterCostumes],
            [] as CharacterCostume[]
          );
          for (const player of this.form.get('scorePlayers')) {
            const control = player.get('idCharacterCostume');
            const idCharacterCostume = control.value;
            if (idCharacterCostume) {
              const selected = characterCostumes.find(characterCostume => characterCostume.id === idCharacterCostume);
              if (selected) {
                control.setValue(selected.id);
              } else {
                control.setValue(-1);
              }
            }
          }
        })
      );
    }),
    shareReplay()
  );

  readonly trackByScorePlayerControl = trackByControl;

  get scorePlayersControl(): ControlArray<ScorePlayerAddForm> {
    return this.form.get('scorePlayers');
  }

  private _getCurrentMode(): Mode | undefined {
    return this.modeQuery.getEntity(this.form.get('idMode').value ?? -1);
  }

  private _changeAllForms(callback: (form: ControlGroup<any>) => void): void {
    callback(this.form);
    callback(this.paramsComponent.form);
    for (const scoreAddPlayerComponent of this.scoreAddPlayerComponents) {
      callback(scoreAddPlayerComponent.form);
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

  onMouseenterCardActions(): void {
    this._changeAllForms(form => form.markAsTouched());
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    this.updateState({ submitting: true });
    // Casting because all fields must be valid, which means all fields were fulfilled
    const dto = this.form.value as ScoreAdd;
    this._changeAllForms(form => form.disable());
    const request$ = this.scoreService.add(dto).pipe(
      tap(async () => {
        await this.dialogService.success(
          {
            title: 'Score submitted successfully!',
            content: 'Your score was submitted and will be reviewed by one of ours administrators',
            btnNo: 'Close',
            btnYes: 'Submit another',
            yesAction: modalRef => {
              this._changeAllForms(form => form.enable());
              this.onReset();
              modalRef.close();
            },
            noAction: modalRef => {
              this.router.navigate(['/']).then();
              modalRef.close();
            },
          },
          { width: 500, disableClose: true }
        );
      })
    );
    this.updateState({ submitModalLoading: true });
    await this.dialogService.info(
      {
        btnNo: 'Cancel',
        btnYes: 'Submit',
        title: 'Submit the score?',
        content: `Before your score reach the leaderboards there will be a review by one of ours administrators. If your score is approved you'll receive a notification.`,
        yesAction: request$,
        noAction: modalRef => {
          this._changeAllForms(form => form.enable());
          modalRef.close();
        },
      },
      { width: 500, disableClose: true }
    );
    this.updateState({ submitModalLoading: false });
  }

  onReset(): void {
    const scorePlayers: Partial<ScorePlayerAddForm>[] = [
      {
        evidence: '',
        host: true,
        description: '',
        idCharacterCostume: null,
        bulletKills: 0,
      },
    ];
    const mode = this._getCurrentMode();
    if (mode && mode.playerQuantity > 1) {
      const playerCount = this.form.get('scorePlayers').length - 1;
      for (let i = 0; i < playerCount; i++) {
        scorePlayers.push({
          personaName: '',
          host: false,
          bulletKills: 0,
          description: '',
          idCharacterCostume: null,
          evidence: '',
          idPlayer: null,
        });
      }
    }
    this.form.patchValue({
      score: 0,
      time: `00"00'00`,
      maxCombo: 0,
      scorePlayers,
    });
    this._changeAllForms(form => form.markAsTouched(false));
  }

  ngOnInit(): void {
    this.idMode$
      .pipe(
        takeUntil(this.destroy$),
        filterNil(),
        switchMap(idMode => this.modeQuery.selectEntity(idMode)),
        filterNil()
      )
      .subscribe(mode => {
        const playersControl = this.form.get('scorePlayers');
        if (mode.playerQuantity > playersControl.length) {
          const diff = mode.playerQuantity - playersControl.length;
          for (let i = 0; i < diff; i++) {
            playersControl.push(generateScorePlayerControlGroup(this.controlBuilder));
          }
        } else if (mode.playerQuantity < playersControl.length) {
          const len = playersControl.length;
          for (let i = mode.playerQuantity; i < len; i++) {
            playersControl.removeAt(i);
          }
        }
      });
  }
}
