import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { Control, ControlBuilder } from '@stlmpp/control';
import { ScoreService } from '../score.service';
import { debounceTime, filter, finalize, map, pluck, shareReplay, switchMap, tap } from 'rxjs/operators';
import { trackByFactory } from '@stlmpp/utils';
import { StateComponent } from '@shared/components/common/state-component';
import { combineLatest, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChangedObject } from '@util/operators/distinct-until-changed-object';
import { orderBy, OrderByDirection } from 'st-utils';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PaginationMetaVW } from '@model/pagination';
import { Stage } from '@model/stage';
import { ScoreTableVW, ScoreTopTableVW, ScoreVW } from '@model/score';

interface TopTableForm extends ParamsForm {
  page: number;
  itemsPerPage: number;
}

export interface ScoreTopTableState {
  tableLoading: boolean;
  orderBy?: number;
  orderByDirection?: OrderByDirection;
  orderByType?: 'stage' | 'total' | 'personaName';
  loadingInfo: boolean;
}

@Component({
  selector: 'bio-score-top-table',
  templateUrl: './score-top-table.component.html',
  styleUrls: ['./score-top-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreTopTableComponent extends StateComponent<ScoreTopTableState> {
  constructor(
    private controlBuilder: ControlBuilder,
    private scoreService: ScoreService,
    private activatedRoute: ActivatedRoute
  ) {
    super({ tableLoading: false, orderByDirection: 'desc', orderByType: 'total', loadingInfo: false });
  }

  private _firstParamsChange = true;

  paramsConfig: Partial<ParamsConfig> = {
    idStage: { show: false },
    idCharacterCostume: { show: false },
  };

  itemsPerPageOptions = [5, 10, 25, 50, 100];

  form = this.controlBuilder.group<TopTableForm>({
    idPlatform: null,
    idGame: null,
    idMiniGame: null,
    idMode: null,
    idStage: null,
    idCharacterCostume: null,
    itemsPerPage: this._getItemsPerPageFromRoute(),
    page: +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
  });

  get pageControl(): Control<number> {
    return this.form.get('page');
  }

  get itemsPerPageControl(): Control<number> {
    return this.form.get('itemsPerPage');
  }

  tableLoading$ = this.selectState('tableLoading');
  order$ = this.selectStateMulti(['orderBy', 'orderByDirection', 'orderByType']);
  loadingInfo$ = this.selectState('loadingInfo');

  scoreTopTable$ = this.form.value$.pipe(
    debounceTime(100),
    distinctUntilChangedObject(),
    filter(params => !!params.idPlatform && !!params.idGame && !!params.idMiniGame && !!params.idMode && !!params.page),
    switchMap(params => {
      this.updateState('tableLoading', true);
      return this.scoreService
        .findTopScoresTable(
          params.idPlatform!,
          params.idGame!,
          params.idMiniGame!,
          params.idMode!,
          params.page,
          params.itemsPerPage
        )
        .pipe(
          finalize(() => {
            this.updateState('tableLoading', false);
          })
        );
    }),
    shareReplay()
  );

  scoreTopTableOrdered$: Observable<ScoreTopTableVW> = combineLatest([
    this.scoreTopTable$,
    this.selectState('orderBy'),
    this.selectState('orderByDirection'),
    this.selectState('orderByType'),
  ]).pipe(
    debounceTime(50),
    map(([scoreTable, idStage, orderByDiretion, orderByType]) => {
      orderByDiretion ??= 'asc';
      switch (orderByType) {
        case 'stage': {
          if (!idStage) {
            return scoreTable;
          }
          return {
            ...scoreTable,
            scoreTables: orderBy(
              scoreTable.scoreTables,
              table => table.scores.find(score => score?.idStage === idStage)?.score ?? 0,
              orderByDiretion
            ),
          };
        }
        default:
          return {
            ...scoreTable,
            scoreTables: orderBy(scoreTable.scoreTables, orderByType, orderByDiretion),
          };
      }
    })
  );

  paginationMeta$: Observable<PaginationMetaVW> = this.scoreTopTable$.pipe(
    pluck('meta'),
    tap(meta => {
      if (meta.currentPage > meta.totalPages) {
        this.changePage(meta.totalPages);
      }
    })
  );

  trackByStage = trackByFactory<Stage>('id');
  trackByPlayer = trackByFactory<ScoreTableVW>('idPlayer');

  private _getItemsPerPageFromRoute(): number {
    const itemsPerPage = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.itemsPerPageOptions.includes(itemsPerPage) ? itemsPerPage : 10;
  }

  private _updateOrderDirection(): void {
    this.updateState('orderByDirection', this.getState('orderByDirection') === 'asc' ? 'desc' : 'asc');
  }

  trackByScore: TrackByFunction<ScoreVW | undefined> = (index, item) => (item ? item.idScore : index);

  updateOrderByStage(idStage?: number): void {
    if (idStage && idStage === this.getState('orderBy')) {
      this._updateOrderDirection();
    } else {
      this.updateState({ orderByType: 'stage', orderBy: idStage });
    }
  }

  updateOrderByTotal(): void {
    if (this.getState('orderByType') === 'total') {
      this._updateOrderDirection();
    } else {
      this.updateState({ orderByType: 'total', orderBy: undefined });
    }
  }

  updateOrderByPlayer(): void {
    if (this.getState('orderByType') === 'personaName') {
      this._updateOrderDirection();
    } else {
      this.updateState({ orderByType: 'personaName', orderBy: undefined });
    }
  }

  changeItemsPerPage($event: number): void {
    this.itemsPerPageControl.setValue($event);
  }

  changePage($event: number): void {
    this.pageControl.setValue($event);
  }

  paramsChange($event: ParamsForm): void {
    if (this._firstParamsChange) {
      this.form.patchValue($event);
      this._firstParamsChange = false;
    } else {
      this.form.patchValue({ ...$event, page: 1 });
    }
  }

  async openScoreInfo(score: ScoreVW): Promise<void> {
    this.updateState({ loadingInfo: true });
    await this.scoreService.openModalScoreInfo({ score, showWorldRecord: true });
    this.updateState({ loadingInfo: false });
  }
}
