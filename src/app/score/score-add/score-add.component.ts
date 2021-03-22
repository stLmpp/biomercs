import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ControlArray, ControlBuilder, ControlGroup, Validators } from '@stlmpp/control';
import { AuthQuery } from '../../auth/auth.query';
import { ParamsComponent, ParamsConfig } from '@shared/params/params.component';
import { CurrencyMaskConfig, CurrencyMaskInputMode } from 'ngx-currency';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { combineLatest } from 'rxjs';
import { debounceTime, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CharacterCostume } from '@model/character-costume';
import { StateComponent } from '@shared/components/common/state-component';
import { filterNil } from '@shared/operators/filter';
import { CharacterService } from '@shared/services/character/character.service';
import { ModeQuery } from '@shared/services/mode/mode.query';
import { ScoreAddPlayerComponent } from './score-add-player/score-add-player.component';
import { generateScorePlayerControlGroup, ScoreAddForm, ScorePlayerAddForm } from './score-add';
import { ScoreService } from '../score.service';
import { ScoreAdd } from '@model/score';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { ModalConfig } from '@shared/components/modal/modal.config';

export interface ScoreAddState {
  characterLoading: boolean;
  submitting: boolean;
}

@Component({
  selector: 'bio-score-add',
  templateUrl: './score-add.component.html',
  styleUrls: ['./score-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CURRENCY_MASK_CONFIG,
      useValue: {
        align: 'left',
        allowNegative: false,
        nullable: true,
        allowZero: true,
        inputMode: CurrencyMaskInputMode.NATURAL,
        precision: 0,
      } as Partial<CurrencyMaskConfig>,
    },
  ],
})
export class ScoreAddComponent extends StateComponent<ScoreAddState> implements OnInit {
  constructor(
    private controlBuilder: ControlBuilder,
    private authQuery: AuthQuery,
    private characterService: CharacterService,
    private modeQuery: ModeQuery,
    private scoreService: ScoreService,
    private dialogService: DialogService
  ) {
    super({ characterLoading: false, submitting: false });
  }

  @ViewChildren(ScoreAddPlayerComponent) scoreAddPlayerComponents!: QueryList<ScoreAddPlayerComponent>;
  @ViewChild(ParamsComponent) paramsComponent!: ParamsComponent;

  maskEnum = MaskEnum;
  maskTimePattern = MaskEnumPatterns[MaskEnum.time]!;

  paramsConfig: Partial<ParamsConfig> = {
    idCharacterCostume: { show: false },
    idGame: { show: true, validators: [Validators.required], errorMessages: { required: 'Game is required' } },
    idMiniGame: { show: true, validators: [Validators.required], errorMessages: { required: 'Mini Game is required' } },
    idMode: { show: true, validators: [Validators.required], errorMessages: { required: 'Mode is required' } },
    idPlatform: { show: true, validators: [Validators.required], errorMessages: { required: 'Platform is required' } },
    idStage: { show: true, validators: [Validators.required], errorMessages: { required: 'Stage is required' } },
  };

  form = this.controlBuilder.group<ScoreAddForm>({
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
        bulletKills: [0, [Validators.required, Validators.min(0)]],
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

  idPlatformNotNil$ = this.form.get('idPlatform').value$.pipe(filterNil());
  idGameNotNil$ = this.form.get('idGame').value$.pipe(filterNil());
  idMiniGameNotNil$ = this.form.get('idMiniGame').value$.pipe(filterNil());
  idModeNotNil$ = this.form.get('idMode').value$.pipe(filterNil());
  characterLoading$ = this.selectState('characterLoading');

  hasIdMode$ = this.form.get('idMode').value$.pipe(map(idMode => !!idMode));

  characters$ = combineLatest([
    this.idPlatformNotNil$,
    this.idGameNotNil$,
    this.idMiniGameNotNil$,
    this.idModeNotNil$,
  ]).pipe(
    debounceTime(0),
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
    })
  );

  get scorePlayersControl(): ControlArray<ScorePlayerAddForm> {
    return this.form.get('scorePlayers');
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

  onSubmit(): void {
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
            title: 'Score submited successfully!',
            content: 'Your score was submitted and will be reviewed by one of ours administrators',
            btnNo: null,
            btnYes: 'Close',
          },
          new ModalConfig({ width: 500, disableClose: true })
        );
      })
    );
    this.dialogService.confirm(
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
      new ModalConfig({ width: 500, disableClose: true })
    );
  }

  ngOnInit(): void {
    this.idModeNotNil$
      .pipe(
        takeUntil(this.destroy$),
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
