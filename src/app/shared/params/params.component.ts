import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Control, ControlBuilder, ControlValidator, ValidatorsModel } from '@stlmpp/control';
import { Nullable } from '../type/nullable';
import { PlatformQuery } from '../services/platform/platform.query';
import { GameService } from '../services/game/game.service';
import { MiniGameService } from '../services/mini-game/mini-game.service';
import { ModeService } from '../services/mode/mode.service';
import { filterNil } from '../operators/filter';
import { debounceTime, distinctUntilChanged, finalize, map, skip, switchMap, takeUntil, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { StageService } from '../services/stage/stage.service';
import { trackByFactory } from '@stlmpp/utils';
import { StateComponent } from '../components/common/state-component';
import { CharacterService } from '../services/character/character.service';
import { distinctUntilChangedObject } from '@util/operators/distinct-until-changed-object';
import { Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CharacterCostume } from '@model/character-costume';
import { Game } from '@model/game';
import { Character } from '@model/character';
import { Mode } from '@model/mode';
import { Stage } from '@model/stage';
import { MiniGame } from '@model/mini-game';
import { Platform } from '@model/platform';

export interface ParamsForm {
  idPlatform: Nullable<number>;
  idGame: Nullable<number>;
  idMiniGame: Nullable<number>;
  idMode: Nullable<number>;
  idStage: Nullable<number>;
  idCharacterCostume: Nullable<number>;
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
  errorMessages?: Record<keyof ValidatorsModel, string>;
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
  inputs: ['idPlatform', 'idGame', 'idMiniGame', 'idMode', 'idStage', 'idCharacterCostume'],
})
export class ParamsComponent
  extends StateComponent<{
    gameLoading: boolean;
    miniGameLoading: boolean;
    modeLoading: boolean;
    stageLoading: boolean;
    characterLoading: boolean;
    clearable: boolean;
  }>
  implements OnChanges, OnInit {
  constructor(
    private controlBuilder: ControlBuilder,
    private platformQuery: PlatformQuery,
    private gameService: GameService,
    private miniGameService: MiniGameService,
    private modeService: ModeService,
    private stageService: StageService,
    private characterService: CharacterService,
    private router: Router
  ) {
    super({
      gameLoading: false,
      miniGameLoading: false,
      modeLoading: false,
      stageLoading: false,
      characterLoading: false,
      clearable: false,
    });
  }

  private _setQueryParamsOnChange = false;

  @Input()
  set config(config: Partial<ParamsConfig>) {
    this.formsConfig = ids.reduce(
      (acc, key) => ({ ...acc, [key]: { ...defaultConfigs[key], ...config[key] } }),
      {} as ParamsConfig
    );
  }

  @Input() set params(params: Partial<ParamsForm> | null) {
    if (params) {
      this.form.patchValue(params, { emitChange: false });
    }
  }

  @Input()
  set setQueryParamsOnChange(setQueryParamsOnChange: boolean) {
    this._setQueryParamsOnChange = coerceBooleanProperty(setQueryParamsOnChange);
  }

  @Input()
  set clearable(clearable: boolean) {
    this.updateState('clearable', coerceBooleanProperty(clearable));
  }

  @Output() idPlatformChange = new EventEmitter<Nullable<number>>();
  @Output() idGameChange = new EventEmitter<Nullable<number>>();
  @Output() idMiniGameChange = new EventEmitter<Nullable<number>>();
  @Output() idModeChange = new EventEmitter<Nullable<number>>();
  @Output() idStageChange = new EventEmitter<Nullable<number>>();
  @Output() idCharacterCostumeChange = new EventEmitter<Nullable<number>>();
  @Output() paramsChange = new EventEmitter<ParamsForm>();

  formsConfig = defaultConfigs;

  form = this.controlBuilder.group<ParamsForm>({
    idPlatform: null,
    idGame: null,
    idMiniGame: null,
    idMode: null,
    idStage: null,
    idCharacterCostume: null,
  });

  get idPlatformControl(): Control<Nullable<number>> {
    return this.form.get('idPlatform');
  }
  get idGameControl(): Control<Nullable<number>> {
    return this.form.get('idGame');
  }
  get idMiniGameControl(): Control<Nullable<number>> {
    return this.form.get('idMiniGame');
  }
  get idModeControl(): Control<Nullable<number>> {
    return this.form.get('idMode');
  }
  get idStageControl(): Control<Nullable<number>> {
    return this.form.get('idStage');
  }
  get idCharacterCostumeControl(): Control<Nullable<number>> {
    return this.form.get('idCharacterCostume');
  }

  idPlatform$ = this.idPlatformControl.value$.pipe(distinctUntilChanged());
  idGame$ = this.idGameControl.value$.pipe(
    distinctUntilChanged(),
    tap(idGame => {
      if (!idGame) {
        this.idMiniGameControl.setValue(null);
      }
    })
  );
  idMiniGame$ = this.idMiniGameControl.value$.pipe(
    distinctUntilChanged(),
    tap(idMiniGame => {
      if (!idMiniGame) {
        this.idModeControl.setValue(null);
      }
    })
  );
  idMode$ = this.idModeControl.value$.pipe(
    distinctUntilChanged(),
    tap(idMode => {
      if (!idMode) {
        this.idStageControl.setValue(null);
        this.idCharacterCostumeControl.setValue(null);
      }
    })
  );
  idStage$ = this.idStageControl.value$.pipe(distinctUntilChanged());
  idCharacterCostume$ = this.idCharacterCostumeControl.value$.pipe(distinctUntilChanged());

  idPlatformNotNil$ = this.idPlatform$.pipe(filterNil());
  idGameNotNil$ = this.idGame$.pipe(filterNil());
  idMiniGameNotNil$ = this.idMiniGame$.pipe(filterNil());
  idModeNotNil$ = this.idMode$.pipe(filterNil());
  idModeSelected$ = this.idMode$.pipe(map(idMode => !!idMode));

  platforms$ = this.platformQuery.all$.pipe(
    tap(() => {
      const idPlatform = this.idPlatformControl.value;
      if (idPlatform) {
        this.idPlatformControl.setValue(idPlatform);
      }
    })
  );
  games$ = this.idPlatformNotNil$.pipe(
    switchMap(idPlatform => {
      this.updateState('gameLoading', true);
      return this.gameService.findByIdPlatform(idPlatform).pipe(
        finalize(() => {
          this.updateState('gameLoading', false);
        }),
        tap(games => {
          const control = this.idGameControl;
          const idGame = control.value;
          if (idGame) {
            const selected = games.find(game => game.id === idGame);
            if (selected) {
              control.setValue(selected.id);
            } else {
              control.setValue(null);
            }
          }
        })
      );
    })
  );
  miniGames$ = combineLatest([this.idPlatformNotNil$, this.idGameNotNil$]).pipe(
    debounceTime(0),
    switchMap(([idPlatform, idGame]) => {
      this.updateState('miniGameLoading', true);
      return this.miniGameService.findByIdPlatformGame(idPlatform, idGame).pipe(
        finalize(() => {
          this.updateState('miniGameLoading', false);
        }),
        tap(miniGames => {
          const control = this.idMiniGameControl;
          const idMiniGame = control.value;
          if (idMiniGame) {
            const selected = miniGames.find(miniGame => miniGame.id === idMiniGame);
            if (selected) {
              control.setValue(selected.id);
            } else {
              control.setValue(null);
            }
          }
        })
      );
    })
  );
  modes$ = combineLatest([this.idPlatformNotNil$, this.idGameNotNil$, this.idMiniGameNotNil$]).pipe(
    debounceTime(0),
    switchMap(([idPlatform, idGame, idMiniGame]) => {
      this.updateState('modeLoading', true);
      return this.modeService.findByIdPlatformGameMiniGame(idPlatform, idGame, idMiniGame).pipe(
        finalize(() => {
          this.updateState('modeLoading', false);
        }),
        tap(modes => {
          const control = this.idModeControl;
          const idMode = control.value;
          if (idMode) {
            const selected = modes.find(mode => mode.id === idMode);
            if (selected) {
              control.setValue(selected.id);
            } else {
              control.setValue(null);
            }
          }
        })
      );
    })
  );
  stages$ = combineLatest([
    this.idPlatformNotNil$,
    this.idGameNotNil$,
    this.idMiniGameNotNil$,
    this.idModeNotNil$,
  ]).pipe(
    debounceTime(0),
    switchMap(([idPlatform, idGame, idMiniGame, idMode]) => {
      this.updateState('stageLoading', true);
      return this.stageService.findByIdPlatformGameMiniGameMode(idPlatform, idGame, idMiniGame, idMode).pipe(
        finalize(() => {
          this.updateState('stageLoading', false);
        }),
        tap(stages => {
          const control = this.idStageControl;
          const idStage = control.value;
          if (idStage) {
            const selected = stages.find(stage => stage.id === idStage);
            if (selected) {
              control.setValue(selected.id);
            } else {
              control.setValue(null);
            }
          }
        })
      );
    })
  );
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
          const control = this.idCharacterCostumeControl;
          const idCharacterCostume = control.value;
          if (idCharacterCostume) {
            const selected = characterCostumes.find(characterCostume => characterCostume.id === idCharacterCostume);
            if (selected) {
              control.setValue(selected.id);
            } else {
              control.setValue(null);
            }
          }
        })
      );
    })
  );

  state$ = this.selectState();

  trackByPlatform = trackByFactory<Platform>('id');
  trackByGame = trackByFactory<Game>('id');
  trackByMiniGame = trackByFactory<MiniGame>('id');
  trackByMode = trackByFactory<Mode>('id');
  trackByStage = trackByFactory<Stage>('id');
  trackByCharacter = trackByFactory<Character>('id');
  trackByCharacterCostume = trackByFactory<CharacterCostume>('id');
  trackByControlValidator = trackByFactory<ControlValidator>('name');

  ngOnInit(): void {
    for (const id of ids) {
      const control = this.form.get(id);
      const formConfig = this.formsConfig[id];
      if (formConfig.show) {
        control.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(idValue => {
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
        skip(1),
        debounceTime(0),
        takeUntil(this.destroy$),
        distinctUntilChangedObject(),
        tap(params => {
          if (this._setQueryParamsOnChange) {
            this.router.navigate([], { queryParamsHandling: 'merge', queryParams: params }).then();
          }
        })
      )
      .subscribe(params => this.paramsChange.emit(params));
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
  static ngAcceptInputType_clearable: BooleanInput;
}
