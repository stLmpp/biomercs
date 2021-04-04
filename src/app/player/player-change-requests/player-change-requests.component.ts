import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScoreService } from '../../score/score.service';
import { ActivatedRoute } from '@angular/router';
import { StateComponent } from '@shared/components/common/state-component';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { filter, finalize, pluck, shareReplay, skip, startWith, switchMap } from 'rxjs/operators';
import { filterNil } from '@shared/operators/filter';
import { Observable } from 'rxjs';
import {
  ScoreChangeRequests,
  ScoreChangeRequestsPaginationVW,
  trackByScoreChangeRequests,
} from '@model/score-change-request';
import { PaginationMetaVW } from '@model/pagination';

export interface PlayerChangeRequestsState {
  page: number;
  itemsPerPage: number;
  loading: boolean;
}

@Component({
  selector: 'bio-player-change-requests',
  templateUrl: './player-change-requests.component.html',
  styleUrls: ['./player-change-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerChangeRequestsComponent extends StateComponent<PlayerChangeRequestsState> {
  constructor(private scoreService: ScoreService, private activatedRoute: ActivatedRoute) {
    super({
      page: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
      itemsPerPage: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10),
      loading: false,
    });
  }

  private _data$: Observable<ScoreChangeRequestsPaginationVW> = this.selectStateMulti(['page', 'itemsPerPage']).pipe(
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
    startWith(this.activatedRoute.snapshot.data.data as ScoreChangeRequestsPaginationVW),
    shareReplay()
  );

  scores$: Observable<ScoreChangeRequests[]> = this._data$.pipe(filterNil(), pluck('scores'));
  meta$: Observable<PaginationMetaVW> = this._data$.pipe(filterNil(), pluck('meta'));

  loading$ = this.selectState('loading');
  trackByScore = trackByScoreChangeRequests;

  onCurrentPageChange($event: number): void {
    this.updateState({ page: $event });
  }

  onItemsPerPageChange($event: number): void {
    this.updateState({ itemsPerPage: $event });
  }
}
