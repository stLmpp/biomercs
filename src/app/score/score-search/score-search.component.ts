import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaginationMeta } from '@model/pagination';
import { Score, ScoreSearch } from '@model/score';
import { combineLatest, debounceTime, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { Control, ControlGroup, StControlModule, StControlCommonModule, StControlValueModule } from '@stlmpp/control';
import { AuthQuery } from '../../auth/auth.query';
import { ScoreService } from '../score.service';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { getScoreDefaultColDefs } from '../util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { GameService } from '@shared/services/game/game.service';
import { filterArrayMinLength, filterNil } from '@util/operators/filter';
import { ModeService } from '@shared/services/mode/mode.service';
import { MiniGameService } from '@shared/services/mini-game/mini-game.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { StageService } from '@shared/services/stage/stage.service';
import { CharacterService } from '@shared/services/character/character.service';
import { coerceBooleanProperty } from 'st-utils';
import { ColDef } from '@shared/components/table/col-def';
import { ScoreOpenInfoCellComponent } from '../score-approval/score-open-info-cell/score-open-info-cell.component';
import { trackById } from '@util/track-by';
import { ScoreModalService } from '../score-modal.service';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Platform } from '@model/platform';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { SelectMultipleComponent } from '../../shared/components/select/select-multiple.component';
import { OptionComponent } from '../../shared/components/select/option.component';
import { OptgroupComponent } from '../../shared/components/select/optgroup.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ScoreListResponsiveComponent } from '../score-list/score-list-responsive/score-list-responsive.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-score-search',
  templateUrl: './score-search.component.html',
  styleUrls: ['./score-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    StControlModule,
    StControlCommonModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    FormFieldComponent,
    SelectMultipleComponent,
    OptionComponent,
    OptgroupComponent,
    InputDirective,
    StControlValueModule,
    CheckboxComponent,
    CardActionsDirective,
    ButtonComponent,
    ScoreListResponsiveComponent,
    AsyncPipe,
  ],
})
export class ScoreSearchComponent extends Destroyable implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private scoreService: ScoreService,
    private authDateFormatPipe: AuthDateFormatPipe,
    private gameService: GameService,
    private miniGameService: MiniGameService,
    private modeService: ModeService,
    private stageService: StageService,
    private characterService: CharacterService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scoreModalService: ScoreModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  gameLoading = false;
  miniGameLoading = false;
  modeLoading = false;
  stageLoading = false;
  characterLoading = false;
  loading = false;
  scores: Score[] = [];
  paginationMeta: PaginationMeta | null = null;

  readonly form = new ControlGroup<ScoreSearch>({
    limit: new Control<number>(this._getParamNumberFromRoute(RouteParamEnum.limit) ?? 10),
    page: new Control<number>(this._getParamNumberFromRoute(RouteParamEnum.page) ?? 1),
    worldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.worldRecord)),
    characterWorldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.characterWorldRecord)),
    combinationWorldRecord: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.combinationWorldRecord)),
    score: new Control<string>(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.score) ?? ''),
    onlyMyScores: new Control<boolean>(this._getParamBooleanFromRoute(RouteParamEnum.onlyMyScores)),
    idScoreStatus: new Control<ScoreStatusEnum | undefined>(ScoreStatusEnum.Approved),
    idPlatforms: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idPlatforms), { updateOn: 'blur' }),
    idGames: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idGames), { updateOn: 'blur' }),
    idMiniGames: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idMiniGames), { updateOn: 'blur' }),
    idModes: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idModes), { updateOn: 'blur' }),
    idStages: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idStages), { updateOn: 'blur' }),
    idCharacterCostumes: new Control<number[]>(this._getParamsArrayFromRoute(RouteParamEnum.idCharacterCostumes), {
      updateOn: 'blur',
    }),
  });

  readonly colDefs: ColDef<Score>[] = [
    { property: 'id', component: ScoreOpenInfoCellComponent, width: '40px', metadata: { showWorldRecord: true } },
    ...getScoreDefaultColDefs(this.authDateFormatPipe),
  ];

  readonly idPlatformsControl = this.form.get('idPlatforms');
  readonly idGamesControl = this.form.get('idGames');
  readonly idMiniGamesControl = this.form.get('idMiniGames');
  readonly idModesControl = this.form.get('idModes');
  readonly idStagesControl = this.form.get('idStages');
  readonly idCharacterCostumesControl = this.form.get('idCharacterCostumes');

  readonly idPlatforms$ = this.idPlatformsControl.value$.pipe(
    tap(idPlatforms => {
      if (!idPlatforms?.length) {
        this.idGamesControl.setValue([]);
        this.idGamesControl.disable();
      } else {
        this.idGamesControl.enable();
      }
    })
  );
  readonly idGames$ = this.idGamesControl.value$.pipe(
    tap(idGames => {
      if (!idGames?.length) {
        this.idMiniGamesControl.setValue([]);
        this.idMiniGamesControl.disable();
      } else {
        this.idMiniGamesControl.enable();
      }
    })
  );
  readonly idMiniGames$ = this.idMiniGamesControl.value$.pipe(
    tap(idMiniGames => {
      if (!idMiniGames?.length) {
        this.idModesControl.setValue([]);
        this.idModesControl.disable();
      } else {
        this.idModesControl.enable();
      }
    })
  );
  readonly idModes$ = this.idModesControl.value$.pipe(
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

  readonly idPlatformsNotNil$ = this.idPlatforms$.pipe(filterNil(), filterArrayMinLength());
  readonly idGamesNotNil$ = this.idGames$.pipe(filterNil(), filterArrayMinLength());
  readonly idMiniGamesNotNil$ = this.idMiniGames$.pipe(filterNil(), filterArrayMinLength());
  readonly idModesNotNil$ = this.idModes$.pipe(filterNil(), filterArrayMinLength());

  readonly platforms: Platform[] = this.activatedRoute.snapshot.data[RouteDataEnum.platforms];

  readonly games$ = this.idPlatformsNotNil$.pipe(
    switchMap(idPlatforms => {
      this.gameLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.gameService.findByIdPlatforms(idPlatforms).pipe(
        finalize(() => {
          this.gameLoading = false;
          this.changeDetectorRef.markForCheck();
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

  readonly miniGames$ = combineLatest([this.idPlatformsNotNil$, this.idGamesNotNil$]).pipe(
    switchMap(([idPlatforms, idGames]) => {
      this.miniGameLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.miniGameService.findByIdPlatformsGames(idPlatforms, idGames).pipe(
        finalize(() => {
          this.miniGameLoading = false;
          this.changeDetectorRef.markForCheck();
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

  readonly modes$ = combineLatest([this.idPlatformsNotNil$, this.idGamesNotNil$, this.idMiniGamesNotNil$]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames]) => {
      this.modeLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.modeService.findByIdPlatformsGamesMiniGames(idPlatforms, idGames, idMiniGames).pipe(
        finalize(() => {
          this.modeLoading = false;
          this.changeDetectorRef.markForCheck();
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

  readonly stages$ = combineLatest([
    this.idPlatformsNotNil$,
    this.idGamesNotNil$,
    this.idMiniGamesNotNil$,
    this.idModesNotNil$,
  ]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames, idModes]) => {
      this.stageLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.stageService.findByIdPlatformsGamesMiniGamesModes(idPlatforms, idGames, idMiniGames, idModes).pipe(
        finalize(() => {
          this.stageLoading = false;
          this.changeDetectorRef.markForCheck();
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

  readonly characters$ = combineLatest([
    this.idPlatformsNotNil$,
    this.idGamesNotNil$,
    this.idMiniGamesNotNil$,
    this.idModesNotNil$,
  ]).pipe(
    switchMap(([idPlatforms, idGames, idMiniGames, idModes]) => {
      this.characterLoading = true;
      this.changeDetectorRef.markForCheck();
      return this.characterService
        .findByIdPlatformsGamesMiniGamesModes(idPlatforms, idGames, idMiniGames, idModes)
        .pipe(
          finalize(() => {
            this.characterLoading = false;
            this.changeDetectorRef.markForCheck();
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

  readonly trackById = trackById;

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

  async openInfoScore(score: Score): Promise<void> {
    await this.scoreModalService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
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
    this.loading = true;
    this.scoreService
      .search(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(({ items, meta }) => {
        this.scores = items;
        this.paginationMeta = meta;
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
