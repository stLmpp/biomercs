import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ScoreService } from '../score.service';
import {
  combineLatest,
  debounceTime,
  filter,
  finalize,
  map,
  Observable,
  pluck,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { trackByFactory, NgLetModule } from '@stlmpp/utils';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { orderBy, OrderByDirection } from 'st-utils';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PaginationMeta } from '@model/pagination';
import { Score, ScoreTable, ScoreTopTable } from '@model/score';
import { LocalState } from '@stlmpp/store';
import { trackById } from '@util/track-by';
import { ScoreModalService } from '../score-modal.service';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { ParamsComponent } from '../../shared/params/params.component';
import { LoadingDirective } from '../../shared/components/spinner/loading/loading.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { AsyncPipe, DecimalPipe } from '@angular/common';

interface TopTableForm extends ParamsForm {
  page: number;
  itemsPerPage: number;
}

export interface ScoreLeaderboardsState {
  tableLoading: boolean;
  orderBy?: number;
  orderByDirection?: OrderByDirection;
  orderByType?: 'stage' | 'total' | 'personaName';
  loadingInfo: boolean;
}

@Component({
  selector: 'bio-score-leaderboards',
  templateUrl: './score-leaderboards.component.html',
  styleUrls: ['./score-leaderboards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    ParamsComponent,
    NgLetModule,
    LoadingDirective,
    IconComponent,
    TooltipDirective,
    ButtonComponent,
    RouterLink,
    CardActionsDirective,
    PaginationComponent,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class ScoreLeaderboardsComponent extends LocalState<ScoreLeaderboardsState> {
  constructor(
    private controlBuilder: ControlBuilder,
    private scoreService: ScoreService,
    private activatedRoute: ActivatedRoute,
    private scoreModalService: ScoreModalService
  ) {
    super({ tableLoading: false, orderByDirection: 'desc', orderByType: 'total', loadingInfo: false });
  }

  private _firstParamsChange = true;

  readonly paramsConfig: Partial<ParamsConfig> = {
    idStage: { show: false },
    idCharacterCostume: { show: false },
    idPlatform: { validators: [Validators.required] },
    idGame: { validators: [Validators.required] },
    idMode: { validators: [Validators.required] },
    idMiniGame: { validators: [Validators.required] },
  };
  readonly itemsPerPageOptions = [5, 10, 25, 50, 100];
  readonly form = this.controlBuilder.group<TopTableForm>({
    idPlatform: null,
    idGame: null,
    idMiniGame: null,
    idMode: null,
    idStage: null,
    idCharacterCostume: null,
    itemsPerPage: this._getItemsPerPageFromRoute(),
    page: +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
  });

  readonly pageControl = this.form.get('page');
  readonly itemsPerPageControl = this.form.get('itemsPerPage');
  readonly tableLoading$ = this.selectState('tableLoading');
  readonly order$ = this.selectState(['orderBy', 'orderByDirection', 'orderByType']);
  readonly loadingInfo$ = this.selectState('loadingInfo');

  readonly scoreTopTable$ = this.form.value$.pipe(
    debounceTime(100),
    filter(params => !!params.idPlatform && !!params.idGame && !!params.idMiniGame && !!params.idMode && !!params.page),
    switchMap(params => {
      this.updateState('tableLoading', true);
      return this.scoreService
        .findLeaderboards(
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

  readonly scoreTopTableOrdered$: Observable<ScoreTopTable> = combineLatest([
    this.scoreTopTable$,
    this.selectState('orderBy'),
    this.selectState('orderByDirection'),
    this.selectState('orderByType'),
  ]).pipe(
    map(([scoreTable, idStage, orderByDirection, orderByType]) => {
      orderByDirection ??= 'asc';
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
              orderByDirection
            ),
          };
        }
        default:
          return {
            ...scoreTable,
            scoreTables: orderBy(scoreTable.scoreTables, orderByType, orderByDirection),
          };
      }
    })
  );

  readonly paginationMeta$: Observable<PaginationMeta> = this.scoreTopTable$.pipe(
    pluck('meta'),
    tap(meta => {
      if (meta.totalPages && meta.currentPage > meta.totalPages) {
        this.changePage(meta.totalPages);
      }
    })
  );

  readonly trackById = trackById;
  readonly trackByPlayer = trackByFactory<ScoreTable>('idPlayer');

  private _getItemsPerPageFromRoute(): number {
    const itemsPerPage = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.itemsPerPageOptions.includes(itemsPerPage) ? itemsPerPage : 10;
  }

  private _updateOrderDirection(): void {
    this.updateState('orderByDirection', this.getState('orderByDirection') === 'asc' ? 'desc' : 'asc');
  }

  readonly trackByScore: TrackByFunction<Score | undefined> = (index, item) => (item ? item.id : index);

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

  async openScoreInfo(score: Score): Promise<void> {
    this.updateState({ loadingInfo: true });
    await this.scoreModalService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
    this.updateState({ loadingInfo: false });
  }
}
