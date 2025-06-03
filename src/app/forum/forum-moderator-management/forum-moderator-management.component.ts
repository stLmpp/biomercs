import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { finalize, map, OperatorFunction } from 'rxjs';
import { ModeratorService } from '../service/moderator.service';
import { ModeratorWithInfo } from '@model/forum/moderator';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { PlayerService } from '../../player/player.service';
import { Player } from '@model/player';
import { orderBy } from 'st-utils';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { trackByFactory } from '@stlmpp/utils';

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
    private playerService: PlayerService,
    private modalRef: ModalRef
  ) {
    super();
  }

  loading = true;
  saving = false;
  loadingPlayers = false;

  // Map has idPlayer as key, and idModerator as value
  readonly moderatorsDeletedMap = new Map<number, number>();
  moderators: ModeratorWithInfo[] = [];
  moderatorsSelected: ModeratorWithInfo[] = [];
  moderatorsSelectedSearch = '';

  readonly trackById = trackByFactory<ModeratorWithInfo>('id');

  private _mapPlayersToModerator(): OperatorFunction<Player[], ModeratorWithInfo[]> {
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
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(playersSelected => {
        this.moderatorsSelected = playersSelected;
      });
  }

  save(): void {
    this.saving = true;
    const add = this.moderatorsSelected.filter(moderator => moderator.id < 0).map(moderator => moderator.idPlayer);
    this.moderatorService
      .addAndDelete({ delete: [...this.moderatorsDeletedMap.values()], add })
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.modalRef.close();
      });
  }

  onSearch(term: string): void {
    if (term.length < 3) {
      this.moderators = [];
      this.changeDetectorRef.markForCheck();
      return;
    }
    this.loadingPlayers = true;
    this.playerService
      .search(term, this._getIdPlayersSelected())
      .pipe(
        finalize(() => {
          this.loadingPlayers = false;
          this.changeDetectorRef.markForCheck();
        }),
        this._mapPlayersToModerator()
      )
      .subscribe(moderators => {
        this.moderators = moderators;
      });
  }

  onRemoveItem(moderator: ModeratorWithInfo): void {
    if (moderator.id > 0) {
      this.moderatorsDeletedMap.set(moderator.idPlayer, moderator.id);
    }
    this.moderatorsSelected = this.moderatorsSelected.filter(_moderator => _moderator.id !== moderator.id);
    this.moderators = orderBy([...this.moderators, moderator], 'playerPersonaName');
  }

  onAllRemoved(): void {
    for (const moderator of this.moderatorsSelected) {
      if (moderator.id > 0) {
        this.moderatorsDeletedMap.set(moderator.idPlayer, moderator.id);
      }
    }
    this.moderators = orderBy([...this.moderators, ...this.moderatorsSelected], 'playerPersonaName');
    this.moderatorsSelected = [];
  }

  onSelectItem(moderator: ModeratorWithInfo): void {
    if (moderator.id > 0) {
      this.moderatorsDeletedMap.delete(moderator.idPlayer);
    }
    this.moderators = this.moderators.filter(_moderator => _moderator.id !== moderator.id);
    this.moderatorsSelected = orderBy([...this.moderatorsSelected, moderator], 'playerPersonaName');
  }

  onAllSelected(): void {
    for (const moderator of this.moderators) {
      if (moderator.id > 0) {
        this.moderatorsDeletedMap.delete(moderator.idPlayer);
      }
    }
    this.moderatorsSelected = orderBy([...this.moderatorsSelected, ...this.moderators], 'playerPersonaName');
    this.moderators = [];
  }

  ngOnInit(): void {
    this._loadModeratorsSelected();
  }
}
