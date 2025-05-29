import { ChangeDetectionStrategy, Component, TrackByFunction, inject } from '@angular/core';
import { ScoreService } from '../score.service';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { LocalState } from '@stlmpp/store';
import { trackByFactory, NgLetModule } from '@stlmpp/utils';
import {
  Score,
  ScoreTableWorldRecord,
  ScoreTableWorldRecordWithoutUndefined,
  ScoreTopTableWorldRecord,
  ScoreTopTableWorldRecordWithoutUndefined,
} from '@model/score';
import { combineLatest, filter, finalize, map, Observable, shareReplay, switchMap } from 'rxjs';
import { orderBy, OrderByDirection, OrderByType } from 'st-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { isNotNil } from '@util/operators/filter';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { trackById } from '@util/track-by';
import { ScoreModalService } from '../score-modal.service';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { ParamsComponent } from '../../shared/params/params.component';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { ScoreListComponent } from '../score-list/score-list/score-list.component';
import { LoadingDirective } from '../../shared/components/spinner/loading/loading.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AsyncPipe, DecimalPipe } from '@angular/common';

export interface ScoreWorldRecordTableState {
  tableLoading: boolean;
  loadingInfoModal: boolean;
  idPlatform: number | null;
  idGame: number | null;
  idMiniGame: number | null;
  idMode: number | null;
  orderByStage: number | null;
  orderByCharacter: boolean;
  orderByDirection: OrderByDirection;
}

@Component({
  selector: 'bio-score-world-records',
  templateUrl: './score-world-records.component.html',
  styleUrls: ['./score-world-records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    ParamsComponent,
    NgLetModule,
    LoadingComponent,
    ScoreListComponent,
    LoadingDirective,
    IconComponent,
    TooltipDirective,
    ButtonComponent,
    AsyncPipe,
    DecimalPipe,
  ],
})
export class ScoreWorldRecordsComponent extends LocalState<ScoreWorldRecordTableState> {
  private scoreService = inject(ScoreService);
  private controlBuilder = inject(ControlBuilder);
  private activatedRoute: ActivatedRoute;
  private router = inject(Router);
  private breakpointObserverService = inject(BreakpointObserverService);
  private scoreModalService = inject(ScoreModalService);

  constructor() {
    const activatedRoute = inject(ActivatedRoute);

    super({
      tableLoading: false,
      loadingInfoModal: false,
      idGame: null,
      idMiniGame: null,
      idMode: null,
      orderByStage: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.orderBy) ?? 0),
      orderByCharacter: false,
      idPlatform: null,
      orderByDirection: 'desc',
    });

    this.activatedRoute = activatedRoute;
  }

  private readonly _scoreTopTable$ = this.selectState(['idPlatform', 'idGame', 'idMiniGame', 'idMode']).pipe(
    filter(params => !!params.idPlatform && !!params.idGame && !!params.idMiniGame && !!params.idMode),
    switchMap(params => {
      this.updateState({ tableLoading: true });
      return this.scoreService
        .findWorldRecordTable(params.idPlatform!, params.idGame!, params.idMiniGame!, params.idMode!)
        .pipe(
          finalize(() => {
            this.updateState({ tableLoading: false });
          })
        );
    }),
    shareReplay()
  );

  readonly tableLoading$ = this.selectState('tableLoading');
  readonly loadingInfoModal$ = this.selectState('loadingInfoModal');
  readonly orderBy$ = this.selectState(['orderByStage', 'orderByDirection', 'orderByCharacter']);
  readonly isMobile$ = this.breakpointObserverService.isMobile$;

  readonly paramsConfig: Partial<ParamsConfig> = {
    idStage: { show: false },
    idCharacterCostume: { show: false },
    idPlatform: { validators: [Validators.required] },
    idGame: { validators: [Validators.required] },
    idMode: { validators: [Validators.required] },
    idMiniGame: { validators: [Validators.required] },
  };

  readonly scoreTopTable$: Observable<ScoreTopTableWorldRecord> = combineLatest([
    this._scoreTopTable$,
    this.orderBy$,
    this.isMobile$,
  ]).pipe(
    map(([scoreTopTable, { orderByStage, orderByDirection, orderByCharacter }, isMobile]) => {
      if ((!orderByStage && !orderByCharacter) || isMobile) {
        return scoreTopTable;
      }
      let orderByValue: OrderByType<ScoreTableWorldRecord>;
      if (orderByStage) {
        orderByValue = scoreTable => scoreTable.scores.find(score => score?.idStage === orderByStage)?.score ?? 0;
      } else {
        orderByValue = 'idCharacterCostume';
      }
      return {
        ...scoreTopTable,
        scoreTables: orderBy(scoreTopTable.scoreTables, orderByValue, orderByDirection),
      };
    })
  );
  readonly scoreTopTableList$: Observable<ScoreTopTableWorldRecordWithoutUndefined> = this.scoreTopTable$.pipe(
    map(scoreTopTable => ({
      ...scoreTopTable,
      scoreTables: scoreTopTable.scoreTables
        .map(scoreTable => ({ ...scoreTable, scores: scoreTable.scores.filter(isNotNil) }))
        .filter(scoreTable => scoreTable.scores.length),
    }))
  );

  readonly trackById = trackById;
  readonly trackByScoreTable = trackByFactory<ScoreTableWorldRecord>('idCharacterCostume');
  readonly trackByScoreTableWithoutUndefined =
    trackByFactory<ScoreTableWorldRecordWithoutUndefined>('idCharacterCostume');
  readonly trackByScore: TrackByFunction<Score | undefined> = (index, item) => (item ? item.id : index);

  paramsChange($event: ParamsForm): void {
    this.updateState($event);
  }

  async openScoreInfo(score: Score): Promise<void> {
    this.updateState({ loadingInfoModal: true });
    await this.scoreModalService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
    this.updateState({ loadingInfoModal: false });
  }

  updateQueryParams(): void {
    const state = this.getState();
    this.router
      .navigate([], {
        relativeTo: this.activatedRoute,
        queryParamsHandling: 'merge',
        queryParams: {
          [RouteParamEnum.orderBy]: state.orderByStage,
          [RouteParamEnum.orderByDirection]: state.orderByDirection,
        },
      })
      .then();
  }

  updateOrderByCharacter(): void {
    if (this.getState('orderByCharacter')) {
      if (this.getState('orderByDirection') === 'desc') {
        this.updateState({ orderByCharacter: false, orderByDirection: 'desc' });
      } else {
        this.updateState({ orderByDirection: 'desc' });
      }
    } else {
      this.updateState({ orderByCharacter: true, orderByDirection: 'asc', orderByStage: null });
    }
  }

  updateOrderByIdStage(idStage: number): void {
    if (this.getState('orderByStage') === idStage) {
      if (this.getState('orderByDirection') === 'asc') {
        this.updateState({ orderByStage: null, orderByDirection: 'desc' });
      } else {
        this.updateState({ orderByDirection: 'asc' });
      }
    } else {
      this.updateState({ orderByStage: idStage, orderByDirection: 'desc', orderByCharacter: false });
    }
    this.updateQueryParams();
  }
}
