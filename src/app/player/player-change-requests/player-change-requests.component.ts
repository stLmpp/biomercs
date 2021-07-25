import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScoreService } from '../../score/score.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { filter, finalize, map, Observable, pluck, shareReplay, skip, switchMap, takeUntil } from 'rxjs';
import { filterNil } from '@shared/operators/filter';
import { ScoreWithScoreChangeRequests, ScoreChangeRequestsPagination } from '@model/score-change-request';
import { PaginationMeta } from '@model/pagination';
import { PlayerService } from '../player.service';
import { LocalState } from '@stlmpp/store';
import { getScoreDefaultColDefs } from '../../score/score-shared/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { ColDef } from '@shared/components/table/col-def';
import {
  PlayerChangeRequestsActionCellComponent,
  PlayerChangeRequestsActionCellComponentMetadata,
} from './player-change-requests-action-cell/player-change-requests-action-cell.component';
import { TableCellNotifyChange } from '@shared/components/table/type';

export interface PlayerChangeRequestsState {
  page: number;
  itemsPerPage: number;
  loading: boolean;
  data: ScoreChangeRequestsPagination;
}

@Component({
  selector: 'bio-player-change-requests',
  templateUrl: './player-change-requests.component.html',
  styleUrls: ['./player-change-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerChangeRequestsComponent extends LocalState<PlayerChangeRequestsState> implements OnInit {
  constructor(
    private scoreService: ScoreService,
    private activatedRoute: ActivatedRoute,
    private playerService: PlayerService,
    private authDateFormatPipe: AuthDateFormatPipe
  ) {
    super({
      page: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
      itemsPerPage: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10),
      loading: false,
      data: activatedRoute.snapshot.data.data,
    });
  }

  private readonly _data$: Observable<ScoreChangeRequestsPagination> = this.selectState('data');

  readonly scores$: Observable<ScoreWithScoreChangeRequests[]> = this._data$.pipe(filterNil(), pluck('scores'));
  readonly paginationMeta$: Observable<PaginationMeta> = this._data$.pipe(filterNil(), pluck('meta'));
  readonly metadata$: Observable<PlayerChangeRequestsActionCellComponentMetadata> = this.paginationMeta$.pipe(
    map(paginationMeta => ({ page: paginationMeta.currentPage, itemsPerPage: paginationMeta.itemsPerPage }))
  );
  readonly loading$ = this.selectState('loading');
  readonly colDefs: ColDef<ScoreWithScoreChangeRequests>[] = [
    {
      property: 'id',
      component: PlayerChangeRequestsActionCellComponent,
      width: '100px',
    },
    ...getScoreDefaultColDefs<ScoreWithScoreChangeRequests>(this.authDateFormatPipe),
  ];

  async openModalChangeRequests(score: ScoreWithScoreChangeRequests): Promise<void> {
    const { page, itemsPerPage } = this.getState();
    const modalRef = await this.playerService.openPlayerChangeRequestsModal({ score, page, itemsPerPage });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.updateState({ data });
      }
    });
  }

  onCurrentPageChange($event: number): void {
    this.updateState({ page: $event });
  }

  onItemsPerPageChange($event: number): void {
    this.updateState({ itemsPerPage: $event });
  }

  onNotifyChange($event: TableCellNotifyChange<ScoreChangeRequestsPagination, ScoreWithScoreChangeRequests>): void {
    if ($event.data) {
      this.updateState({ data: $event.data });
    }
  }

  ngOnInit(): void {
    this.selectState(['page', 'itemsPerPage'])
      .pipe(
        skip(1),
        filter(({ page, itemsPerPage }) => !!page && !!itemsPerPage),
        switchMap(({ page, itemsPerPage }) => {
          this.updateState({ loading: true });
          return this.scoreService.findChangeRequests(page, itemsPerPage).pipe(
            finalize(() => {
              this.updateState({ loading: false });
            })
          );
        }),
        shareReplay(),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        this.updateState({ data });
      });
  }
}
