import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { debounceTime, filter, finalize, map, OperatorFunction, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ModeratorService } from '../service/moderator.service';
import { ModeratorWithInfo } from '@model/forum/moderator';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { PlayerService } from '../../player/player.service';
import { Player } from '@model/player';
import { orderBy } from 'st-utils';

interface ModeratorManage extends ModeratorWithInfo {
  disabled: boolean;
}

function mapModeratorsManage(moderators: ModeratorWithInfo[]): ModeratorManage[] {
  return moderators.map(moderator => ({ ...moderator, disabled: !moderator.deleteAllowed }));
}

let uid = -1;

@Component({
  selector: 'bio-forum-moderator-management',
  templateUrl: './forum-moderator-management.component.html',
  styleUrls: ['./forum-moderator-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumModeratorManagementComponent extends Destroyable implements OnInit {
  constructor(
    private moderatorService: ModeratorService,
    private changeDetectorRef: ChangeDetectorRef,
    private playerService: PlayerService
  ) {
    super();
  }

  private readonly _term$ = new Subject<string>();

  loading = true;
  saving = false;
  loadingPlayers = false;

  // Map has idPlayer as key, and idModerator as value
  moderatorsDeletedMap = new Map<number, number>();
  moderators: ModeratorManage[] = [];
  moderatorsSelected: ModeratorManage[] = [];

  label: keyof ModeratorManage = 'playerPersonaName';
  disabledKey: keyof ModeratorManage = 'disabled';

  private _mapPlayersToModerator(): OperatorFunction<Player[], ModeratorManage[]> {
    return map(players =>
      players.map(player => {
        const id = this.moderatorsDeletedMap.get(player.id);
        if (id) {
          this.moderatorsDeletedMap.delete(player.id);
        }
        return {
          idPlayer: player.id,
          playerPersonaName: player.personaName,
          disabled: false,
          deleteAllowed: true,
          id: id ?? uid--,
        };
      })
    );
  }

  private _getIdPlayersSelected(): number[] {
    return this.moderatorsSelected.map(moderator => moderator.idPlayer);
  }

  private _loadModeratorsSelected(): void {
    this.moderatorService
      .getAll()
      .pipe(
        map(mapModeratorsManage),
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(playersSelected => {
        this.moderatorsSelected = playersSelected;
      });
  }

  private _listenToSearch(): void {
    this._term$
      .pipe(
        debounceTime(400),
        tap(term => {
          if (term.length < 3) {
            this.moderators = [];
            this.changeDetectorRef.markForCheck();
          }
        }),
        filter(term => term.length >= 3),
        switchMap(term => {
          this.loadingPlayers = true;
          this.changeDetectorRef.markForCheck();
          return this.playerService.search(term, this._getIdPlayersSelected()).pipe(
            finalize(() => {
              this.loadingPlayers = false;
              this.changeDetectorRef.markForCheck();
            })
          );
        }),
        this._mapPlayersToModerator(),
        takeUntil(this.destroy$)
      )
      .subscribe(moderators => {
        this.moderators = moderators;
      });
  }

  save(): void {
    // TODO
  }

  onSearch($event: string): void {
    this._term$.next($event);
  }

  onRemoveItem($event: ModeratorManage): void {
    if ($event.id > 0) {
      this.moderatorsDeletedMap.set($event.idPlayer, $event.id);
    }
    this.moderatorsSelected = this.moderatorsSelected.filter(moderator => moderator.id !== $event.id);
    this.moderators = orderBy([...this.moderators, $event], 'playerPersonaName');
  }

  onAllRemoved($event: ModeratorManage[]): void {
    for (const moderator of $event) {
      if (moderator.id > 0) {
        this.moderatorsDeletedMap.set(moderator.idPlayer, moderator.id);
      }
    }
    this.moderatorsSelected = [];
    this.moderators = orderBy([...this.moderators, ...$event], 'playerPersonaName');
  }

  onSelectItem($event: ModeratorManage): void {
    if ($event.id > 0) {
      this.moderatorsDeletedMap.delete($event.idPlayer);
    }
    this.moderators = this.moderators.filter(moderator => moderator.id !== $event.id);
    this.moderatorsSelected = orderBy([...this.moderatorsSelected, $event], 'playerPersonaName');
  }

  onAllSelected($event: ModeratorManage[]): void {
    for (const moderator of $event) {
      if (moderator.id > 0) {
        this.moderatorsDeletedMap.delete(moderator.idPlayer);
      }
    }
    this.moderatorsSelected = orderBy([...this.moderatorsSelected, ...$event], 'playerPersonaName');
    this.moderators = [];
  }

  ngOnInit(): void {
    this._loadModeratorsSelected();
    this._listenToSearch();
    (window as any).c = this;
  }
}
