import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PaginationMetaVW } from '@model/pagination';
import { ScoreSearch, ScoreVW } from '@model/score';
import { LocalState } from '@stlmpp/store';
import { debounceTime, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Control, ControlGroup } from '@stlmpp/control';
import { AuthQuery } from '../../auth/auth.query';
import { ScoreService } from '../score.service';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { getScoreDefaultColDefs } from '../score-shared/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { PlatformQuery } from '@shared/services/platform/platform.query';
import { trackByPlaform } from '@model/platform';
import { GameService } from '@shared/services/game/game.service';
import { filterArrayMinLength, filterNil } from '@shared/operators/filter';
import { trackByGame } from '@model/game';
import { combineLatest } from 'rxjs';
import { ModeService } from '@shared/services/mode/mode.service';
import { MiniGameService } from '@shared/services/mini-game/mini-game.service';
import { trackByMiniGame } from '@model/mini-game';
import { trackByMode } from '@model/mode';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { StageService } from '@shared/services/stage/stage.service';
import { trackByStage } from '@model/stage';
import { CharacterService } from '@shared/services/character/character.service';
import { trackByCharacter } from '@model/character';
import { trackByCharacterCostume } from '@model/character-costume';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export interface ScoreSearchComponentState {
  scores: ScoreVW[];
  paginationMeta: PaginationMetaVW;
  loading: boolean;
  gameLoading: boolean;
  miniGameLoading: boolean;
  modeLoading: boolean;
  stageLoading: boolean;
  characterLoading: boolean;
}

@Component({
  selector: 'bio-score-search',
  templateUrl: './score-search.component.html',
  styleUrls: ['./score-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreSearchComponent extends LocalState<ScoreSearchComponentState> implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private scoreService: ScoreService,
    private authDateFormatPipe: AuthDateFormatPipe,
    private platformQuery: PlatformQuery,
    private gameService: GameService,
    private miniGameService: MiniGameService,
    private modeService: ModeService,
    private stageService: StageService,
    private characterService: CharacterService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super({
      scores: [],
      paginationMeta: {
        itemCount: 0,
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10,
      },
      loading: false,
      gameLoading: false,
      miniGameLoading: false,
      modeLoading: false,
      stageLoading: false,
      characterLoading: false,
    });
  }

  scores$ = this.selectState('scores');
  paginationMeta$ = this.selectState('paginationMeta');
  loading$ = this.selectState('loading');
  gameLoading$ = this.selectState('gameLoading');
  miniGameLoading$ = this.selectState('miniGameLoading');
  modeLoading$ = this.selectState('modeLoading');
  stageLoading$ = this.selectState('stageLoading');
  characterLoading$ = this.selectState('characterLoading');

  form = new ControlGroup<ScoreSearch>({
    limit: new Control<number>(this._getParamNumberFromRoute(RouteParamEnum.limit) ?? 10),
    page: new Control<number>(this._getParamNumberFromRoute(RouteParamEnum.page) ?? 1),
    worldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.worldRecord)),
    characterWorldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.characterWorldRecord)),
    combinationWorldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.combinationWorldRecord)),
    score: new Control<string>(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.score) ?? ''),
    onlyMyScores: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.onlyMyScores)),
    status: new Control<ScoreStatusEnum | undefined>(ScoreStatusEnum.Approved),
    idPlatforms: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idPlatforms), { updateOn: 'blur' }),
    idGames: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idGames), { updateOn: 'blur' }),
    idMiniGames: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idMiniGames), { updateOn: 'blur' }),
    idModes: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idModes), { updateOn: 'blur' }),
    idStages: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idStages), { updateOn: 'blur' }),
    idCharacterCostumes: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idCharacterCostumes), {
      updateOn: 'blur',
    }),
  });

  colDefs = getScoreDefaultColDefs(this.authDateFormatPipe);

  get idPlatformsControl(): Control<number[] | null | undefined> {
    return this.form.get('idPlatforms');
  }

  get idGamesControl(): Control<number[] | null | undefined> {
    return this.form.get('idGames');
  }

  get idMiniGamesControl(): Control<number[] | null | undefined> {
    return this.form.get('idMiniGames');
  }

  get idModesControl(): Control<number[] | null | undefined> {
    return this.form.get('idModes');
  }

  get idStagesControl(): Control<number[] | null | undefined> {
    return this.form.get('idStages');
  }

  get idCharacterCostumesControl(): Control<number[] | null | undefined> {
    return this.form.get('idCharacterCostumes');
  }

  idPlatforms$ = this.idPlatformsControl.value$.pipe(
    tap(idPlatforms => {
      if (!idPlatforms?.length) {
        this.idGamesControl.setValue([]);
        this.idGamesControl.disable();
      } else {
        this.idGamesControl.enable();
      }
    })
  );
  idGames$ = this.idGamesControl.value$.pipe(
    tap(idGames => {
      if (!idGames?.length) {
        this.idMiniGamesControl.setValue([]);
        this.idMiniGamesControl.disable();
      } else {
        this.idMiniGamesControl.enable();
      }
    })
  );
  idMiniGames$ = this.idMiniGamesControl.value$.pipe(
    tap(idMiniGames => {
      if (!idMiniGames?.length) {
        this.idModesControl.setValue([]);
        this.idModesControl.disable();
      } else {
        this.idModesControl.enable();
      }
    })
  );
  idModes$ = this.idModesControl.value$.pipe(
    tap(idModes => {
      if (!idModes?.length) {
        this.idStagesControl.setValue([]);
        this.idCharacterCostumesControl.setValue([]);
        this.idStagesControl.disable();
        this.idCharacterCostumesControl.disable();
      } else {
        this.idStagesControl.enable();
        this.idCharacterCostumesControl.enable();
      }
    })
  );

  idPlatformsNotNil$ = this.idPlatforms$.pipe(filterNil(), filterArrayMinLength());
  idGamesNotNil$ = this.idGames$.pipe(filterNil(), filterArrayMinLength());
  idMiniGamesNotNil$ = this.idMiniGames$.pipe(filterNil(), filterArrayMinLength());
  idModesNotNil$ = this.idModes$.pipe(filterNil(), filterArrayMinLength());

  platforms$ = this.platformQuery.all$;

  games$ = this.idPlatformsNotNil$.pipe(
    switchMap(idPlatforms => {
      this.updateState({ gameLoading: true });
      return this.gameService.findByIdPlatforms(idPlatforms).pipe(
        finalize(() => {
          this.updateState({ gameLoading: false });
        }),
        tap(games => {
          const control = this.idGamesControl;
          const idGames = control.value;
          if (idGames?.length) {
            control.setValue(idGames.filter(idGame => games.some(game => game.id === idGame)));
          }
        })
      );
    })
  );

  miniGames$ = combineLatest([this.idPlatformsNotNil$, this.idGamesNotNil$]).pipe(
    switchMap(([idPlatforms, idGames]) => {
      this.updateState({ miniGameLoading: true });
      return this.miniGameService.findByIdPlatformsGames(idPlatforms, idGames).pipe(
        finalize(() => {
          this.updateState({ miniGameLoading: false });
        })
      );
    }),
    tap(miniGames => {
      const control = this.idMiniGamesControl;
      const idMiniGames = this.idMiniGamesControl.value;
      if (idMiniGames?.length) {
        control.setValue(idMiniGames.filter(idMiniGame => miniGames.some(miniGame => miniGame.id === idMiniGame)));
      }
    })
  );

  modes$ = combineLatest([this.idPlatformsNotNil$, this.idGamesNotNil$, this.idMiniGamesNotNil$]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames]) => {
      this.updateState({ modeLoading: true });
      return this.modeService.findByIdPlatformsGamesMiniGames(idPlatforms, idGames, idMiniGames).pipe(
        finalize(() => {
          this.updateState({ modeLoading: false });
        })
      );
    }),
    tap(modes => {
      const control = this.idModesControl;
      const idModes = control.value;
      if (idModes?.length) {
        control.setValue(idModes.filter(idMode => modes.some(mode => mode.id === idMode)));
      }
    })
  );

  stages$ = combineLatest([
    this.idPlatformsNotNil$,
    this.idGamesNotNil$,
    this.idMiniGamesNotNil$,
    this.idModesNotNil$,
  ]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames, idModes]) => {
      this.updateState({ stageLoading: true });
      return this.stageService.findByIdPlatformsGamesMiniGamesModes(idPlatforms, idGames, idMiniGames, idModes).pipe(
        finalize(() => {
          this.updateState({ stageLoading: false });
        })
      );
    }),
    tap(stages => {
      const control = this.idStagesControl;
      const idStages = control.value;
      if (idStages?.length) {
        control.setValue(idStages.filter(idStage => stages.some(stage => stage.id === idStage)));
      }
    })
  );

  characters$ = combineLatest([
    this.idPlatformsNotNil$,
    this.idGamesNotNil$,
    this.idMiniGamesNotNil$,
    this.idModesNotNil$,
  ]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames, idModes]) => {
      this.updateState({ characterLoading: true });
      return this.characterService
        .findByIdPlatformsGamesMiniGamesModes(idPlatforms, idGames, idMiniGames, idModes)
        .pipe(
          finalize(() => {
            this.updateState({ characterLoading: false });
          })
        );
    }),
    tap(characters => {
      const control = this.idCharacterCostumesControl;
      const idCharacterCostumes = control.value;
      if (idCharacterCostumes?.length) {
        control.setValue(
          idCharacterCostumes.filter(idCharacterCostume =>
            characters.some(character =>
              character.characterCostumes.some(characterCostume => characterCostume.id === idCharacterCostume)
            )
          )
        );
      }
    })
  );

  trackByPlatform = trackByPlaform;
  trackByGame = trackByGame;
  trackByMiniGame = trackByMiniGame;
  trackByMode = trackByMode;
  trackByStage = trackByStage;
  trackByCharacter = trackByCharacter;
  trackByCharacterCostume = trackByCharacterCostume;

  private _getParamsArrayFromRoute(param: string): number[] {
    const ids = this.activatedRoute.snapshot.queryParamMap.getAll(param) ?? [];
    return ids.map(Number);
  }

  private _getParamBooleanFromRoute(param: string): boolean {
    return (
      this.activatedRoute.snapshot.queryParamMap.has(param) &&
      coerceBooleanProperty(this.activatedRoute.snapshot.queryParamMap.get(param))
    );
  }

  private _getParamNumberFromRoute(param: string): number | null {
    return this.activatedRoute.snapshot.queryParamMap.has(param)
      ? +this.activatedRoute.snapshot.queryParamMap.get(param)!
      : null;
  }

  onCurrentPageChange($event: number): void {
    this.form.get('page').setValue($event);
    this.onSearch();
  }

  onItemsPerPageChange($event: number): void {
    this.form.get('limit').setValue($event);
    this.onSearch();
  }

  async openInfoScore(score: ScoreVW): Promise<void> {
    await this.scoreService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
  }

  onSearch(): void {
    let params = this.form.value;
    const keysArray: (keyof Pick<
      ScoreSearch,
      'idPlatforms' | 'idGames' | 'idMiniGames' | 'idModes' | 'idStages' | 'idCharacterCostumes'
    >)[] = ['idPlatforms', 'idGames', 'idMiniGames', 'idModes', 'idStages', 'idCharacterCostumes'];
    for (const key of keysArray) {
      if (!params[key]?.length) {
        params = { ...params, [key]: null };
      }
    }
    this.updateState({ loading: true });
    this.scoreService
      .search(params)
      .pipe(
        finalize(() => {
          this.updateState({ loading: false });
        })
      )
      .subscribe(({ items, meta }) => {
        this.updateState({ paginationMeta: meta, scores: items });
      });
  }

  ngOnInit(): void {
    this.form.valueChanges$
      .pipe(
        debounceTime(500),
        tap(({ limit, page, ...params }) => {
          this.router
            .navigate([], {
              queryParamsHandling: 'merge',
              queryParams: params,
              relativeTo: this.activatedRoute,
            })
            .then();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
