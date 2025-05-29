import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, inject, input, output } from '@angular/core';
import {
  Control,
  ControlBuilder,
  ControlValidator,
  ValidatorsKeys,
  StControlCommonModule,
  StControlModule,
} from '@stlmpp/control';
import { GameService } from '../services/game/game.service';
import { MiniGameService } from '../services/mini-game/mini-game.service';
import { ModeService } from '../services/mode/mode.service';
import { filterNil } from '@util/operators/filter';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  MonoTypeOperatorFunction,
  Observable,
  shareReplay,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { StageService } from '../services/stage/stage.service';
import { trackByFactory, NgLetModule, StUtilsObjectModule } from '@stlmpp/utils';
import { CharacterService } from '../services/character/character.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { CharacterCostume } from '@model/character-costume';
import { Game } from '@model/game';
import { Mode } from '@model/mode';
import { Stage } from '@model/stage';
import { MiniGame } from '@model/mini-game';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { Platform } from '@model/platform';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { filterNilArrayOperator } from '@util/operators/filter-nil-array';
import { trackById } from '@util/track-by';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { FormFieldComponent } from '../components/form/form-field.component';
import { SelectComponent } from '../components/select/select.component';
import { OptionComponent } from '../components/select/option.component';
import { FormFieldErrorsDirective } from '../components/form/errors.directive';
import { FormFieldErrorComponent } from '../components/form/error.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { OptgroupComponent } from '../components/select/optgroup.component';
import { AsyncPipe } from '@angular/common';

export interface ParamsForm {
  idPlatform: number | null | undefined;
  idGame: number | null | undefined;
  idMiniGame: number | null | undefined;
  idMode: number | null | undefined;
  idStage: number | null | undefined;
  idCharacterCostume: number | null | undefined;
}

export const PARAMS_FORM_NULL: ParamsForm = {
  idPlatform: null,
  idMode: null,
  idMiniGame: null,
  idGame: null,
  idCharacterCostume: null,
  idStage: null,
};

const ids: (keyof ParamsForm)[] = ['idPlatform', 'idGame', 'idMiniGame', 'idMode', 'idStage', 'idCharacterCostume'];

export interface ParamConfig {
  validators?: ControlValidator[];
  errorMessages?: Record<ValidatorsKeys, string>;
  show?: boolean;
  clearable?: boolean;
}

export type ParamsConfig = Record<keyof ParamsForm, ParamConfig>;

const defaultConfigs: ParamsConfig = {
  idCharacterCostume: { show: true },
  idPlatform: { show: true },
  idStage: { show: true },
  idMode: { show: true },
  idMiniGame: { show: true },
  idGame: { show: true },
};

@Component({
  selector: 'bio-params',
  templateUrl: './params.component.html',
  styleUrls: ['./params.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlCommonModule,
    StControlModule,
    FormFieldComponent,
    NgLetModule,
    SelectComponent,
    OptionComponent,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    SpinnerComponent,
    OptgroupComponent,
    AsyncPipe,
    StUtilsObjectModule,
  ],
})
export class ParamsComponent extends Destroyable implements OnChanges, OnInit {
  private controlBuilder = inject(ControlBuilder);
  private gameService = inject(GameService);
  private miniGameService = inject(MiniGameService);
  private modeService = inject(ModeService);
  private stageService = inject(StageService);
  private characterService = inject(CharacterService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);


  private _setQueryParamsOnChange = false;
  private _selectParamIfOne = true;
  private _clearable = false;
  private readonly _approval$ = new BehaviorSubject(false);

  readonly idPlatform = input<number | null>(null);
  readonly idGame = input<number | null>(null);
  readonly idMiniGame = input<number | null>(null);
  readonly idMode = input<number | null>(null);
  readonly idStage = input<number | null>(null);
  readonly idCharacterCostume = input<number | null>(null);

  @Input()
  get clearable(): boolean {
    return this._clearable;
  }
  set clearable(clearable: boolean) {
    this._clearable = coerceBooleanProperty(clearable);
  }

  @Input()
  set config(config: Partial<ParamsConfig>) {
    this.formsConfig = ids.reduce(
      (acc, key) => ({ ...acc, [key]: { ...defaultConfigs[key], ...config[key] } }),
      {} as ParamsConfig
    );
  }

  @Input()
  set params(params: Partial<ParamsForm> | null) {
    if (params) {
      this.form.patchValue(params, { emitChange: false });
    }
  }

  @Input()
  set setQueryParamsOnChange(setQueryParamsOnChange: boolean) {
    this._setQueryParamsOnChange = coerceBooleanProperty(setQueryParamsOnChange);
  }

  @Input()
  set selectParamIfOne(selectParamIfOne: boolean) {
    this._selectParamIfOne = coerceBooleanProperty(selectParamIfOne);
  }

  @Input()
  set approval(approval: boolean) {
    this._approval$.next(coerceBooleanProperty(approval));
  }

  readonly idPlatformChange = output<number | null | undefined>();
  readonly idGameChange = output<number | null | undefined>();
  readonly idMiniGameChange = output<number | null | undefined>();
  readonly idModeChange = output<number | null | undefined>();
  readonly idStageChange = output<number | null | undefined>();
  readonly idCharacterCostumeChange = output<number | null | undefined>();

  readonly platformChange = output<Platform | null | undefined>();
  readonly gameChange = output<Game | null | undefined>();
  readonly miniGameChange = output<MiniGame | null | undefined>();
  readonly modeChange = output<Mode | null | undefined>();
  readonly stageChange = output<Stage | null | undefined>();
  readonly characterCostumeChange = output<CharacterCostume | null | undefined>();

  readonly paramsChange = output<ParamsForm>();

  formsConfig = defaultConfigs;

  readonly form = this.controlBuilder.group<ParamsForm>({
    idPlatform: this._getParamOrNull(RouteParamEnum.idPlatform),
    idGame: this._getParamOrNull(RouteParamEnum.idGame),
    idMiniGame: this._getParamOrNull(RouteParamEnum.idMiniGame),
    idMode: this._getParamOrNull(RouteParamEnum.idMode),
    idStage: this._getParamOrNull(RouteParamEnum.idStage),
    idCharacterCostume: this._getParamOrNull(RouteParamEnum.idCharacterCostume),
  });
  readonly idPlatformControl = this.form.get('idPlatform');
  readonly idGameControl = this.form.get('idGame');
  readonly idMiniGameControl = this.form.get('idMiniGame');
  readonly idModeControl = this.form.get('idMode');
  readonly idStageControl = this.form.get('idStage');
  readonly idCharacterCostumeControl = this.form.get('idCharacterCostume');

  readonly idPlatform$ = this.idPlatformControl.value$.pipe(distinctUntilChanged());
  readonly idGame$ = this.idGameControl.value$.pipe(
    distinctUntilChanged(),
    tap(idGame => {
      if (!idGame) {
        this.idMiniGameControl.setValue(null);
        this.idMiniGameControl.disable();
      } else {
        this.idMiniGameControl.enable();
      }
    })
  );
  readonly idMiniGame$ = this.idMiniGameControl.value$.pipe(
    distinctUntilChanged(),
    tap(idMiniGame => {
      if (!idMiniGame) {
        this.idModeControl.setValue(null);
        this.idModeControl.disable();
      } else {
        this.idModeControl.enable();
      }
    })
  );
  readonly idMode$ = this.idModeControl.value$.pipe(
    distinctUntilChanged(),
    tap(idMode => {
      if (!idMode) {
        this.idStageControl.setValue(null);
        this.idCharacterCostumeControl.setValue(null);
        this.idStageControl.disable();
        this.idCharacterCostumeControl.disable();
      } else {
        this.idStageControl.enable();
        this.idCharacterCostumeControl.enable();
      }
    })
  );
  readonly idStage$ = this.idStageControl.value$.pipe(distinctUntilChanged());
  readonly idCharacterCostume$ = this.idCharacterCostumeControl.value$.pipe(distinctUntilChanged());
  readonly idPlatformNotNil$ = this.idPlatform$.pipe(filterNil());

  readonly platforms$ = this._selectPlatforms().pipe(
    tap(platforms => {
      const idPlatform = this.idPlatformControl.value;
      if (idPlatform) {
        this.idPlatformControl.setValue(idPlatform);
      } else if (this._selectParamIfOne && platforms.length === 1) {
        this.idPlatformControl.setValue(platforms[0].id);
      }
    }),
    shareReplay()
  );
  readonly games$ = this.idPlatformNotNil$.pipe(
    switchMap(idPlatform => this._selectGames(idPlatform).pipe(this._setParamOrNullOperator<Game>(this.idGameControl))),
    shareReplay()
  );
  readonly miniGames$ = combineLatest([this.idPlatform$, this.idGame$]).pipe(
    filterNilArrayOperator(),
    switchMap(([idPlatform, idGame]) =>
      this._selectMiniGames(idPlatform, idGame).pipe(this._setParamOrNullOperator<MiniGame>(this.idMiniGameControl))
    ),
    shareReplay()
  );
  readonly modes$ = combineLatest([this.idPlatform$, this.idGame$, this.idMiniGame$]).pipe(
    filterNilArrayOperator(),
    switchMap(([idPlatform, idGame, idMiniGame]) =>
      this._selectModes(idPlatform, idGame, idMiniGame).pipe(this._setParamOrNullOperator<Mode>(this.idModeControl))
    ),
    shareReplay()
  );
  readonly stages$ = combineLatest([this.idPlatform$, this.idGame$, this.idMiniGame$, this.idMode$]).pipe(
    filterNilArrayOperator(),
    switchMap(([idPlatform, idGame, idMiniGame, idMode]) =>
      this._selectStages(idPlatform, idGame, idMiniGame, idMode).pipe(
        this._setParamOrNullOperator<Stage>(this.idStageControl)
      )
    ),
    shareReplay()
  );
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
          this._setParamOrNull(this.idCharacterCostumeControl, characterCostumes);
        })
      );
    }),
    shareReplay()
  );

  gameLoading = false;
  miniGameLoading = false;
  modeLoading = false;
  stageLoading = false;
  characterLoading = false;

  readonly trackById = trackById;
  readonly trackByControlValidator = trackByFactory<ControlValidator>('name');

  private _selectPlatforms(): Observable<Platform[]> {
    return this._approval$.pipe(
      switchMap(approval => {
        const key: RouteDataEnum = approval ? RouteDataEnum.platformApproval : RouteDataEnum.platforms;
        return this.activatedRoute.data.pipe(map(data => data[key] ?? []));
      }),
      tap(platforms => {
        const idPlatform = this.idPlatformControl.value;
        if (idPlatform) {
          this.platformChange.emit(platforms.find(platform => platform.id === idPlatform));
        }
      })
    );
  }

  private _selectGames(idPlatform: number): Observable<Game[]> {
    return this._approval$.pipe(
      switchMap(approval => {
        this.gameLoading = true;
        this.changeDetectorRef.markForCheck();
        let request$ = this.gameService.findByIdPlatform(idPlatform);
        if (approval) {
          request$ = this.gameService.findApprovalByIdPlatform(idPlatform);
        }
        return request$.pipe(
          finalize(() => {
            this.gameLoading = false;
            this.changeDetectorRef.markForCheck();
          }),
          tap(games => {
            const idGame = this.idGameControl.value;
            if (idGame) {
              this.gameChange.emit(games.find(game => game.id === idGame));
            }
          })
        );
      })
    );
  }

  private _selectMiniGames(idPlatform: number, idGame: number): Observable<MiniGame[]> {
    return this._approval$.pipe(
      switchMap(approval => {
        this.miniGameLoading = true;
        this.changeDetectorRef.markForCheck();
        let request$ = this.miniGameService.findByIdPlatformGame(idPlatform, idGame);
        if (approval) {
          request$ = this.miniGameService.findApprovalByIdPlatformGame(idPlatform, idGame);
        }
        return request$.pipe(
          finalize(() => {
            this.miniGameLoading = false;
            this.changeDetectorRef.markForCheck();
          }),
          tap(miniGames => {
            const idMiniGame = this.idMiniGameControl.value;
            if (idMiniGame) {
              this.miniGameChange.emit(miniGames.find(miniGame => miniGame.id === idMiniGame));
            }
          })
        );
      })
    );
  }

  private _selectModes(idPlatform: number, idGame: number, idMiniGame: number): Observable<Mode[]> {
    return this._approval$.pipe(
      switchMap(approval => {
        this.modeLoading = true;
        this.changeDetectorRef.markForCheck();
        let request$ = this.modeService.findByIdPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
        if (approval) {
          request$ = this.modeService.findApprovalByIdPlatformGameMiniGame(idPlatform, idGame, idMiniGame);
        }
        return request$.pipe(
          finalize(() => {
            this.modeLoading = false;
            this.changeDetectorRef.markForCheck();
          }),
          tap(modes => {
            const idMode = this.idModeControl.value;
            if (idMode) {
              this.modeChange.emit(modes.find(mode => mode.id === idMode));
            }
          })
        );
      })
    );
  }

  private _selectStages(idPlatform: number, idGame: number, idMiniGame: number, idMode: number): Observable<Stage[]> {
    return this._approval$.pipe(
      switchMap(approval => {
        this.stageLoading = true;
        this.changeDetectorRef.markForCheck();
        let request$ = this.stageService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
        if (approval) {
          request$ = this.stageService.findApprovalByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode);
        }
        return request$.pipe(
          finalize(() => {
            this.stageLoading = false;
            this.changeDetectorRef.markForCheck();
          }),
          tap(stages => {
            const idStage = this.idStageControl.value;
            if (idStage) {
              this.stageChange.emit(stages.find(stage => stage.id === idStage));
            }
          })
        );
      })
    );
  }

  private _getParamOrNull(param: string): number | null {
    const id = this.activatedRoute.snapshot.queryParamMap.get(param);
    return id ? +id : null;
  }

  private _setParamOrNull<T extends { id: number }>(control: Control<number | null | undefined>, entities: T[]): void {
    const id = control.value;
    const exists = entities.some(entity => entity.id === id);
    if (exists) {
      return;
    }
    let value: number | null = null;
    if (this._selectParamIfOne && entities.length === 1) {
      value = entities[0].id;
    }
    control.setValue(value);
  }

  private _setParamOrNullOperator<T extends { id: number }>(
    control: Control<number | null | undefined>
  ): MonoTypeOperatorFunction<T[]> {
    return tap(entities => {
      this._setParamOrNull(control, entities);
    });
  }

  ngOnInit(): void {
    for (const id of ids) {
      const control = this.form.get(id);
      const formConfig = this.formsConfig[id];
      if (formConfig.show) {
        control.value$.pipe(takeUntil(this.destroy$), debounceTime(50), distinctUntilChanged()).subscribe(idValue => {
          const keyChange = `${id}Change` as `${keyof ParamsForm}Change`;
          this[keyChange].emit(idValue);
        });
      }
      if (formConfig.validators) {
        control.setValidators(formConfig.validators);
      }
    }
    this.form.value$
      .pipe(
        takeUntil(this.destroy$),
        tap(params => {
          if (this._setQueryParamsOnChange) {
            this.router.navigate([], { queryParamsHandling: 'merge', queryParams: params }).then();
          }
        }),
        debounceTime(50)
      )
      .subscribe(params => {
        this.paramsChange.emit(params);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const params: Partial<ParamsForm> = {};
    for (const [key, change] of Object.entries(changes) as [keyof ParamsForm, SimpleChange][]) {
      if (ids.includes(key)) {
        params[key] = change.currentValue;
      }
    }
    this.form.patchValue(params);
  }

  static ngAcceptInputType_setQueryParamsOnChange: BooleanInput;
  static ngAcceptInputType_getQueryParamsOnInit: BooleanInput;
  static ngAcceptInputType_clearable: BooleanInput;
  static ngAcceptInputType_selectParamIfOne: BooleanInput;
  static ngAcceptInputType_approval: BooleanInput;
}
