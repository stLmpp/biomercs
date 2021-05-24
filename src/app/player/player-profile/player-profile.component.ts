import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerQuery } from '../player.query';
import { RouterQuery } from '@stlmpp/router';
import { debounceTime, filter, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { PlayerService } from '../player.service';
import { Animations } from '@shared/animations/animations';
import { AuthQuery } from '../../auth/auth.query';
import { RegionService } from '../../region/region.service';
import { RegionQuery } from '../../region/region.query';
import { DynamicLoaderService } from '../../core/dynamic-loader.service';
import { Player, PlayerUpdate } from '@model/player';
import { isObjectEmpty } from 'st-utils';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { LocalState } from '@stlmpp/store';
import {
  ScoreGroupedByStatus,
  ScoreScoreGroupedByStatusScoreVW,
  trackByScoreGroupedByStatus,
} from '@model/score-grouped-by-status';
import { ActivatedRoute } from '@angular/router';
import { ScoreVW } from '@model/score';
import { ScoreService } from '../../score/score.service';
import { getScoreDefaultColDefs } from '../../score/score-shared/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { ColDef } from '@shared/components/table/col-def';
import { ScoreOpenInfoCellComponent } from '../../score/score-shared/score-open-info-cell/score-open-info-cell.component';
import { combineLatest, Observable } from 'rxjs';

interface PlayerProfileComponentState {
  loadingRegion: boolean;
  update: PlayerUpdate;
  scoreGroupedByStatus: ScoreGroupedByStatus[];
  loadingLinkSteam: boolean;
  editMode: boolean;
}

@Component({
  selector: 'bio-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.collapse.collapse()],
})
export class PlayerProfileComponent extends LocalState<PlayerProfileComponentState> implements OnInit {
  constructor(
    private playerQuery: PlayerQuery,
    private routerQuery: RouterQuery,
    private playerService: PlayerService,
    private authQuery: AuthQuery,
    private regionService: RegionService,
    private regionQuery: RegionQuery,
    private dynamicLoaderService: DynamicLoaderService,
    private activatedRoute: ActivatedRoute,
    private scoreService: ScoreService,
    private authDateFormatPipe: AuthDateFormatPipe
  ) {
    super({
      loadingRegion: false,
      update: {},
      scoreGroupedByStatus: activatedRoute.snapshot.data.scoreGroupedByStatus ?? [],
      loadingLinkSteam: false,
      editMode: false,
    });
  }

  private _update$ = this.selectState('update');
  private _idPlayer$ = this.routerQuery.selectParams(RouteParamEnum.idPlayer).pipe(
    filter(idPlayer => !!idPlayer),
    map(Number)
  );

  player$ = this._idPlayer$.pipe(switchMap(idPlayer => this.playerQuery.selectEntity(idPlayer)));
  isSameAsLogged$ = this._idPlayer$.pipe(switchMap(idPlayer => this.authQuery.selectIsSameAsLogged(idPlayer)));
  loadingRegion$ = this.selectState('loadingRegion');
  scoreGroupedByStatus$ = this.selectState('scoreGroupedByStatus');
  loadingLinkSteam$ = this.selectState('loadingLinkSteam');
  editMode$ = this.selectState('editMode');
  state$: Observable<{ editMode: boolean; isSameAsLogged: boolean }> = combineLatest({
    editMode: this.editMode$,
    isSameAsLogged: this.isSameAsLogged$,
  });

  colDefs: ColDef<ScoreScoreGroupedByStatusScoreVW>[] = [
    { property: 'idScore', component: ScoreOpenInfoCellComponent, width: '40px' },
    ...getScoreDefaultColDefs<ScoreScoreGroupedByStatusScoreVW>(this.authDateFormatPipe),
  ];

  trackByScoreGroupByStatus = trackByScoreGroupedByStatus;

  get idPlayer(): number {
    // idPlayer is required to access this component
    return +this.routerQuery.getParams(RouteParamEnum.idPlayer)!;
  }

  get player(): Player {
    return this.playerQuery.getEntity(this.idPlayer)!;
  }

  private _update(dto: PlayerUpdate): void {
    this.playerService.update(this.idPlayer, dto).subscribe();
  }

  private _updateScore(
    idScoreStatus: number,
    idScore: number,
    partial: Partial<ScoreScoreGroupedByStatusScoreVW>
  ): void {
    this.updateState('scoreGroupedByStatus', scoreGroupedByStatus =>
      scoreGroupedByStatus.map(status => {
        if (status.idScoreStatus === idScoreStatus) {
          status = {
            ...status,
            scores: status.scores.map(score => {
              if (score.idScore === idScore) {
                score = { ...score, ...partial };
              }
              return score;
            }),
          };
        }
        return status;
      })
    );
  }

  update<K extends keyof PlayerUpdate>(key: K, value: PlayerUpdate[K]): void {
    this.updateState('update', update => ({ ...update, [key]: value }));
  }

  async openModalSelectRegion(): Promise<void> {
    if (!this.authQuery.getIsSameAsLogged(this.player)) {
      return;
    }
    const idRegionPlayer = this.player.region?.id ?? -1;
    this.updateState('loadingRegion', true);
    await this.regionService.showSelectModal(idRegionPlayer, idRegion =>
      this.playerService.update(this.idPlayer, { idRegion })
    );
    this.updateState('loadingRegion', false);
  }

  preloadRegions(): void {
    if (!this.regionQuery.getLoading() && !this.regionQuery.getAll().length) {
      this.dynamicLoaderService.preloadRequest(this.regionService.get());
    }
  }

  async openScoreInfo(score: ScoreVW): Promise<void> {
    this._updateScore(score.idScoreStatus, score.idScore, { disabled: true });
    await this.scoreService.openModalScoreInfo({ score });
    this._updateScore(score.idScoreStatus, score.idScore, { disabled: false });
  }

  linkSteam(idPlayer: number): void {
    this.updateState({ loadingLinkSteam: true });
    this.playerService
      .linkSteam(idPlayer)
      .pipe(
        finalize(() => {
          this.updateState({ loadingLinkSteam: false });
        })
      )
      .subscribe();
  }

  toggleEditMode(): void {
    this.updateState('editMode', editMode => !editMode);
  }

  ngOnInit(): void {
    this._update$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        filter(update => !isObjectEmpty(update))
      )
      .subscribe(update => {
        this._update(update);
        this.updateState({ update: {} });
      });
  }
}
