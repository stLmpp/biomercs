import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Control,
  ControlArray,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { AuthQuery } from '../../auth/auth.query';
import { ParamsComponent, ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';
import { MaskEnum, MaskEnumPatterns } from '@shared/mask/mask.enum';
import { combineLatest, distinctUntilChanged, finalize, map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { CharacterCostume } from '@model/character-costume';
import { CharacterService } from '@shared/services/character/character.service';
import { ScoreAddPlayerComponent } from './score-add-player/score-add-player.component';
import { generateScorePlayerControlGroup, ScoreAddForm, ScorePlayerAddForm } from './score-add';
import { ScoreService } from '../score.service';
import { ScoreAdd } from '@model/score';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { Mode } from '@model/mode';
import { scoreCurrencyMask } from '../util';
import { Router } from '@angular/router';
import { filterNilArrayOperator } from '@util/operators/filter-nil-array';
import { trackByControl } from '@util/track-by';
import { isNotNil, isObjectEqualShallow } from 'st-utils';
import { filterNil } from '@util/operators/filter';
import { PlatformInputTypeService } from '@shared/services/platform-input-type/platform-input-type.service';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { NgLetModule } from '@stlmpp/utils';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { ParamsComponent as ParamsComponent_1 } from '../../shared/params/params.component';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { CurrencyMaskDirective } from '../../shared/currency-mask/currency-mask.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { MaskDirective } from '../../shared/mask/mask.directive';
import { DatepickerDirective } from '../../shared/components/datepicker/datepicker/datepicker.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SuffixDirective } from '../../shared/components/common/suffix.directive';
import { DatepickerTriggerDirective } from '../../shared/components/datepicker/datepicker/datepicker-trigger.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { DatepickerComponent } from '../../shared/components/datepicker/datepicker/datepicker.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { AsyncPipe } from '@angular/common';
import { AsyncDefaultPipe } from '../../shared/async-default/async-default.pipe';

@Component({
  selector: 'bio-score-add',
  templateUrl: './score-add.component.html',
  styleUrls: ['./score-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: scoreCurrencyMask }],
  imports: [
    PageTitleComponent,
    NgLetModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    ParamsComponent_1,
    StControlModule,
    StControlCommonModule,
    ScoreAddPlayerComponent,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    CurrencyMaskDirective,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    MaskDirective,
    DatepickerDirective,
    ButtonComponent,
    SuffixDirective,
    DatepickerTriggerDirective,
    IconComponent,
    DatepickerComponent,
    CardActionsDirective,
    AsyncPipe,
    AsyncDefaultPipe,
  ],
})
export class ScoreAddComponent {
  constructor(
    private authQuery: AuthQuery,
    private characterService: CharacterService,
    private scoreService: ScoreService,
    private dialogService: DialogService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private platformInputTypeService: PlatformInputTypeService
  ) {}

  @ViewChildren(ScoreAddPlayerComponent) readonly scoreAddPlayerComponents!: QueryList<ScoreAddPlayerComponent>;
  @ViewChild(ParamsComponent) readonly paramsComponent!: ParamsComponent;

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

  readonly form = this._getControlGroup();
  readonly params$: Observable<Partial<ParamsForm>> = this.form.valueChanges$.pipe(
    map(form => {
      const params: Partial<ParamsForm> = {
        idPlatform: form.idPlatform,
        idGame: form.idGame,
        idMiniGame: form.idMiniGame,
        idMode: form.idMode,
        idStage: form.idStage,
      };

      return params;
    }),
    distinctUntilChanged(isObjectEqualShallow)
  );

  readonly idPlatform$ = this.form.get('idPlatform').value$.pipe(distinctUntilChanged());
  readonly idGame$ = this.form.get('idGame').value$.pipe(distinctUntilChanged());
  readonly idMiniGame$ = this.form.get('idMiniGame').value$.pipe(distinctUntilChanged());
  readonly idMode$ = this.form.get('idMode').value$.pipe(distinctUntilChanged());
  characterLoading = false;
  submitModalLoading = false;
  platformInputTypeLoading = false;

  readonly hasIdMode$ = this.form.get('idMode').value$.pipe(map(idMode => !!idMode));

  readonly characters$ = combineLatest([this.idPlatform$, this.idGame$, this.idMiniGame$, this.idMode$]).pipe(
    filterNilArrayOperator(),
    switchMap(([idPlatform, idGame, idMiniGame, idMode]) => {
      this.characterLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.characterService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode).pipe(
        finalize(() => {
          this.characterLoading = false;
          this.changeDetectorRef.markForCheck();
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
  readonly platformInputTypes$ = this.idPlatform$.pipe(
    filterNil(),
    switchMap(idPlatform => {
      this.platformInputTypeLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.platformInputTypeService.getByPlatform(idPlatform).pipe(
        finalize(() => {
          this.platformInputTypeLoading = false;
          this.changeDetectorRef.markForCheck();
        })
      );
    })
  );

  readonly trackByScorePlayerControl = trackByControl;

  readonly scorePlayersControl = this.form.get('scorePlayers');

  readonly idPlayersSelected$: Observable<number[]> = this.scorePlayersControl.value$.pipe(
    map(scorePlayers => scorePlayers.map(scorePlayer => scorePlayer.idPlayer).filter(isNotNil))
  );

  currentMode?: Mode;

  private _getControlGroup(): ControlGroup<ScoreAddForm> {
    const user = this.authQuery.getUser()!;
    return new ControlGroup<ScoreAddForm>({
      idGame: new Control(null, [Validators.required]),
      idMiniGame: new Control(null, [Validators.required]),
      idMode: new Control(null, [Validators.required]),
      idPlatform: new Control(null, [Validators.required]),
      idStage: new Control(null, [Validators.required]),
      score: new Control(0, [Validators.required]),
      maxCombo: new Control(0, [Validators.required, Validators.min(0), Validators.max(400)]),
      time: new Control(`00'00"00`, [Validators.required]),
      achievedDate: new Control(undefined),
      scorePlayers: new ControlArray<ScorePlayerAddForm>([
        generateScorePlayerControlGroup({
          idPlayer: user.idPlayer,
          idPlayerPersonaName: user.playerPersonaName,
          personaName: user.playerPersonaName,
          host: true,
        }),
      ]),
    });
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
    // Casting because all fields must be valid, which means all fields were fulfilled
    const dto = this.form.value as ScoreAdd;
    this._changeAllForms(form => form.disable());
    const request$ = this.scoreService.add(dto).pipe(
      tap(async () => {
        await this.dialogService.success(
          {
            title: 'Score submitted successfully!',
            content: 'Your score was submitted and will be reviewed by one of ours administrators',
            buttons: [
              {
                title: 'Close',
                action: modalRef => {
                  this.router.navigate(['/']).then();
                  modalRef.close();
                },
              },
              {
                title: 'Submit another',
                action: modalRef => {
                  this._changeAllForms(form => form.enable());
                  this.onReset();
                  modalRef.close();
                },
                backdropAction: true,
              },
            ],
          },
          { width: 500 }
        );
      })
    );
    this.submitModalLoading = true;
    await this.dialogService.info(
      {
        title: 'Submit the score?',
        content: `Before your score reach the leaderboards there will be a review by one of ours administrators. If your score is approved you'll receive a notification.`,
        buttons: [
          {
            title: 'Cancel',
            action: modalRef => {
              this._changeAllForms(form => form.enable());
              modalRef.close();
            },
            backdropAction: true,
          },
          { title: 'Submit', action: request$ },
        ],
      },
      { width: 500 }
    );
    this.submitModalLoading = false;
    this.changeDetectorRef.markForCheck();
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
    if (this.currentMode && this.currentMode.playerQuantity > 1) {
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

  onModeChange(mode: Mode | null | undefined): void {
    if (!mode) {
      return;
    }
    const playersControl = this.form.get('scorePlayers');
    if (mode.playerQuantity > playersControl.length) {
      const diff = mode.playerQuantity - playersControl.length;
      for (let i = 0; i < diff; i++) {
        playersControl.push(generateScorePlayerControlGroup());
      }
    } else if (mode.playerQuantity < playersControl.length) {
      const len = playersControl.length;
      for (let i = mode.playerQuantity; i < len; i++) {
        playersControl.removeAt(i);
      }
    }
  }
}
