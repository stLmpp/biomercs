import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerQuery } from '../player.query';
import {
  combineLatest,
  concat,
  debounceTime,
  finalize,
  map,
  Observable,
  pluck,
  skip,
  switchMap,
  takeUntil,
} from 'rxjs';
import { PlayerService } from '../player.service';
import { Animations } from '@shared/animations/animations';
import { AuthQuery } from '../../auth/auth.query';
import { RegionService } from '../../region/region.service';
import { DynamicLoaderService } from '../../core/dynamic-loader.service';
import { Player, PlayerUpdate } from '@model/player';
import { arrayUtil, isObjectEmpty } from 'st-utils';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { LocalState } from '@stlmpp/store';
import {
  ScoreGroupedByStatus,
  ScoreScoreGroupedByStatusScoreVW,
  trackByScoreGroupedByStatus,
} from '@model/score-grouped-by-status';
import { ActivatedRoute } from '@angular/router';
import { Score } from '@model/score';
import { getScoreDefaultColDefs } from '../../score/score-shared/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { ColDef } from '@shared/components/table/col-def';
import { ScoreOpenInfoCellComponent } from '../../score/score-shared/score-open-info-cell/score-open-info-cell.component';
import { isBefore, subDays } from 'date-fns';
import { filterNil } from '@shared/operators/filter';
import { mdiSteam } from '@mdi/js';
import { RegionModalService } from '../../region/region-modal.service';
import { ScoreModalService } from '../../score/score-modal.service';
import { mapToParam } from '@util/operators/map-to-param';

interface PlayerProfileComponentState {
  loadingRegion: boolean;
  update: PlayerUpdate;
  scoreGroupedByStatus: ScoreGroupedByStatus[];
  loadingLinkSteam: boolean;
  editMode: boolean;
  newPersonaName: string | null;
  saving: boolean;
}

@Component({
  selector: 'bio-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut()],
})
export class PlayerProfileComponent extends LocalState<PlayerProfileComponentState> implements OnInit {
  constructor(
    private playerQuery: PlayerQuery,
    private playerService: PlayerService,
    private authQuery: AuthQuery,
    private regionService: RegionService,
    private dynamicLoaderService: DynamicLoaderService,
    private activatedRoute: ActivatedRoute,
    private authDateFormatPipe: AuthDateFormatPipe,
    private regionModalService: RegionModalService,
    private scoreModalService: ScoreModalService
  ) {
    super({
      loadingRegion: false,
      update: {},
      scoreGroupedByStatus: activatedRoute.snapshot.data.scoreGroupedByStatus ?? [],
      loadingLinkSteam: false,
      editMode: false,
      newPersonaName: null,
      saving: false,
    });
  }

  private readonly _idPlayer$ = this.activatedRoute.paramMap.pipe(
    mapToParam(RouteParamEnum.idPlayer),
    filterNil(),
    map(Number)
  );

  readonly saving$ = this.selectState('saving');
  readonly player$ = this._idPlayer$.pipe(
    switchMap(idPlayer => this.playerQuery.selectEntity(idPlayer)),
    filterNil()
  );
  readonly isSameAsLogged$ = this._idPlayer$.pipe(switchMap(idPlayer => this.authQuery.selectIsSameAsLogged(idPlayer)));
  readonly loadingRegion$ = this.selectState('loadingRegion');
  readonly scoreGroupedByStatus$ = this.selectState('scoreGroupedByStatus');
  readonly loadingLinkSteam$ = this.selectState('loadingLinkSteam');
  readonly editMode$ = this.selectState('editMode');
  readonly canSave$ = combineLatest([this.selectState(['update', 'newPersonaName']), this.player$]).pipe(
    debounceTime(100),
    map(
      ([{ update, newPersonaName }, player]) =>
        !isObjectEmpty(update) || this._validatePersonaName(player, newPersonaName)
    )
  );
  readonly state$: Observable<{ editMode: boolean; isSameAsLogged: boolean; saving: boolean; canSave: boolean }> =
    combineLatest({
      editMode: this.editMode$,
      isSameAsLogged: this.isSameAsLogged$,
      saving: this.saving$,
      canSave: this.canSave$,
    });

  readonly colDefs: ColDef<ScoreScoreGroupedByStatusScoreVW>[] = [
    { property: 'id', component: ScoreOpenInfoCellComponent, width: '40px' },
    ...getScoreDefaultColDefs<ScoreScoreGroupedByStatusScoreVW>(this.authDateFormatPipe),
  ];

  readonly todayMinusSevenDate = subDays(new Date(), 7);
  readonly mdiSteam = mdiSteam;
  readonly trackByScoreGroupByStatus = trackByScoreGroupedByStatus;

  get idPlayer(): number {
    // idPlayer is required to access this component
    return +this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.idPlayer)!;
  }

  get player(): Player {
    return this.playerQuery.getEntity(this.idPlayer)!;
  }

  private _validatePersonaName(player: Player, personaName: string | null): personaName is string {
    return (
      !!personaName &&
      personaName.length >= 3 &&
      personaName !== player.personaName &&
      (!player.lastUpdatedPersonaNameDate || isBefore(player.lastUpdatedPersonaNameDate, subDays(new Date(), 7)))
    );
  }

  private _updateScore(
    idScoreStatus: number,
    idScore: number,
    partial: Partial<ScoreScoreGroupedByStatusScoreVW>
  ): void {
    this.updateState('scoreGroupedByStatus', scoreGroupedByStatus =>
      arrayUtil(scoreGroupedByStatus, 'idScoreStatus')
        .update(idScoreStatus, status => ({
          ...status,
          scores: arrayUtil(status.scores, 'id').update(idScore, partial).toArray(),
        }))
        .toArray()
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
    await this.regionModalService.showSelectModal(idRegionPlayer, idRegion =>
      this.playerService.update(this.idPlayer, { idRegion })
    );
    this.updateState('loadingRegion', false);
  }

  preloadRegions(): void {
    if (this.authQuery.getIsSameAsLogged(this.idPlayer)) {
      this.dynamicLoaderService.preloadRequest(this.regionService.get());
    }
  }

  async openScoreInfo(score: Score): Promise<void> {
    this._updateScore(score.idScoreStatus, score.id, { disabled: true });
    await this.scoreModalService.openModalScoreInfo({ score });
    this._updateScore(score.idScoreStatus, score.id, { disabled: false });
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
    const editMode = this.getState('editMode');
    const update: Partial<PlayerProfileComponentState> = {};
    if (editMode) {
      update.update = {};
      update.newPersonaName = null;
    }
    this.updateState({ editMode: !editMode, ...update });
  }

  save(): void {
    const player = this.player;
    const { update, newPersonaName } = this.getState();
    const requests = [];
    if (this._validatePersonaName(player, newPersonaName)) {
      requests.push(this.playerService.updatePersonaName(player.id, newPersonaName));
    }
    if (!isObjectEmpty(update)) {
      requests.push(this.playerService.update(player.id, update));
    }
    if (!requests.length) {
      this.updateState({ editMode: false, update: {}, newPersonaName: null });
      return;
    }
    this.updateState({ saving: true });
    concat(...requests)
      .pipe(
        finalize(() => {
          this.updateState({ saving: false, editMode: false, update: {}, newPersonaName: null });
        })
      )
      .subscribe();
  }

  updatePersonaName($event: string): void {
    this.updateState('newPersonaName', $event);
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$), pluck('scoreGroupedByStatus'), skip(1), filterNil())
      .subscribe((scoreGroupedByStatus: ScoreGroupedByStatus[]) => {
        this.updateState({ scoreGroupedByStatus });
      });
  }
}
