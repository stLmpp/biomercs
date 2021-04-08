import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScoreService } from '../../score/score.service';
import { ActivatedRoute } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { filter, finalize, pluck, shareReplay, skip, switchMap, takeUntil } from 'rxjs/operators';
import { filterNil } from '@shared/operators/filter';
import { Observable } from 'rxjs';
import {
  ScoreChangeRequests,
  ScoreChangeRequestsPaginationVW,
  trackByScoreChangeRequests,
} from '@model/score-change-request';
import { PaginationMetaVW } from '@model/pagination';
import { PlayerService } from '../player.service';
import { LocalState } from '@stlmpp/store';

export interface PlayerChangeRequestsState {
  page: number;
  itemsPerPage: number;
  loading: boolean;
  loadingModal: boolean;
  data: ScoreChangeRequestsPaginationVW;
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
    private playerService: PlayerService
  ) {
    super({
      page: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
      itemsPerPage: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10),
      loading: false,
      loadingModal: false,
      data: activatedRoute.snapshot.data.data,
    });
  }

  private _data$: Observable<ScoreChangeRequestsPaginationVW> = this.selectState('data');

  scores$: Observable<ScoreChangeRequests[]> = this._data$.pipe(filterNil(), pluck('scores'));
  meta$: Observable<PaginationMetaVW> = this._data$.pipe(filterNil(), pluck('meta'));

  loading$ = this.selectState('loading');
  loadingModal$ = this.selectState('loadingModal');

  trackByScore = trackByScoreChangeRequests;

  async openModalChangeRequests(score: ScoreChangeRequests): Promise<void> {
    this.updateState({ loadingModal: true });
    const { page, itemsPerPage } = this.getState();
    const modalRef = await this.playerService.openPlayerChangeRequestsModal({ score, page, itemsPerPage });
    modalRef.onClose$.subscribe(data => {
      if (data) {
        this.updateState({ data });
      }
    });
    this.updateState({ loadingModal: false });
  }

  onCurrentPageChange($event: number): void {
    this.updateState({ page: $event });
  }

  onItemsPerPageChange($event: number): void {
    this.updateState({ itemsPerPage: $event });
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
