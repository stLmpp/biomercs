import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayerQuery } from '../player.query';
import { RouterQuery } from '@stlmpp/router';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
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

@Component({
  selector: 'bio-player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.collapse.collapse()],
})
export class PlayerProfileComponent
  extends LocalState<{ editMode: boolean; loadingRegion: boolean }>
  implements OnInit
{
  constructor(
    private playerQuery: PlayerQuery,
    private routerQuery: RouterQuery,
    private playerService: PlayerService,
    private authQuery: AuthQuery,
    private regionService: RegionService,
    private regionQuery: RegionQuery,
    private dynamicLoaderService: DynamicLoaderService
  ) {
    super({ editMode: false, loadingRegion: false });
  }

  private _update$ = new BehaviorSubject<PlayerUpdate>({});
  private _idPlayer$ = this.routerQuery.selectParams(RouteParamEnum.idPlayer).pipe(
    filter(idPlayer => !!idPlayer),
    map(Number)
  );

  editMode$ = this.selectState('editMode');
  player$ = this._idPlayer$.pipe(switchMap(idPlayer => this.playerQuery.selectEntity(idPlayer)));
  isSameAsLogged$ = this._idPlayer$.pipe(switchMap(idPlayer => this.authQuery.selectIsSameAsLogged(idPlayer)));
  loadingRegion$ = this.selectState('loadingRegion');

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

  toggleEditMode(): void {
    this.updateState('editMode', !this.getState('editMode'));
  }

  update<K extends keyof PlayerUpdate>(key: K, value: PlayerUpdate[K]): void {
    this._update$.next({ ...this._update$.value, [key]: value });
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

  ngOnInit(): void {
    this._update$
      .pipe(
        filter(update => !isObjectEmpty(update)),
        debounceTime(500)
      )
      .subscribe(update => {
        this._update(update);
        this._update$.next({});
      });
  }
}
