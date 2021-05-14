import { ChangeDetectionStrategy, Component, TrackByFunction } from '@angular/core';
import { ScoreService } from '../../score.service';
import { ControlBuilder } from '@stlmpp/control';
import { ParamsConfig, ParamsForm } from '@shared/params/params.component';
import { LocalState } from '@stlmpp/store';
import { trackByFactory } from '@stlmpp/utils';
import { Stage } from '@model/stage';
import {
  ScoreTableWorldRecord,
  ScoreTableWorldRecordWithoutUndefined,
  ScoreTopTableWorldRecord,
  ScoreTopTableWorldRecordWithoutUndefined,
  ScoreVW,
} from '@model/score';
import { filter, finalize, map, shareReplay, switchMap } from 'rxjs/operators';
import { orderBy, OrderByDirection, OrderByType } from 'st-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { combineLatest, Observable } from 'rxjs';
import { isNotNil } from '@shared/operators/filter';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';

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
  selector: 'bio-score-world-record-table',
  templateUrl: './score-world-record-table.component.html',
  styleUrls: ['./score-world-record-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreWorldRecordTableComponent extends LocalState<ScoreWorldRecordTableState> {
  constructor(
    private scoreService: ScoreService,
    private controlBuilder: ControlBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserverService: BreakpointObserverService
  ) {
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
  }

  private _scoreTopTable$ = this.selectState(['idPlatform', 'idGame', 'idMiniGame', 'idMode']).pipe(
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

  tableLoading$ = this.selectState('tableLoading');
  loadingInfoModal$ = this.selectState('loadingInfoModal');
  orderBy$ = this.selectState(['orderByStage', 'orderByDirection', 'orderByCharacter']);

  paramsConfig: Partial<ParamsConfig> = {
    idStage: { show: false },
    idCharacterCostume: { show: false },
  };

  scoreTopTable$: Observable<ScoreTopTableWorldRecord> = combineLatest([this._scoreTopTable$, this.orderBy$]).pipe(
    map(([scoreTopTable, { orderByStage, orderByDirection, orderByCharacter }]) => {
      if (!orderByStage && !orderByCharacter) {
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
  scoreTopTableList$: Observable<ScoreTopTableWorldRecordWithoutUndefined> = this.scoreTopTable$.pipe(
    map(scoreTopTable => ({
      ...scoreTopTable,
      scoreTables: scoreTopTable.scoreTables
        .map(scoreTable => ({ ...scoreTable, scores: scoreTable.scores.filter(isNotNil) }))
        .filter(scoreTable => scoreTable.scores.length),
    }))
  );

  isMobile$ = this.breakpointObserverService.isMobile$;

  trackByStage = trackByFactory<Stage>('id');
  trackByScoreTable = trackByFactory<ScoreTableWorldRecord>('idCharacterCostume');
  trackByScoreTableWithoutUndefined = trackByFactory<ScoreTableWorldRecordWithoutUndefined>('idCharacterCostume');

  trackByScore: TrackByFunction<ScoreVW | undefined> = (index, item) => (item ? item.idScore : index);

  paramsChange($event: ParamsForm): void {
    this.updateState($event);
  }

  async openScoreInfo(score: ScoreVW): Promise<void> {
    this.updateState({ loadingInfoModal: true });
    await this.scoreService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
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
