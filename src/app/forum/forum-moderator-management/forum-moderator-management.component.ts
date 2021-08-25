import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModeratorService } from '../service/moderator.service';
import { ModeratorAddAndDeleteDto, ModeratorWithInfo } from '@model/forum/moderator';
import { combineLatest, debounceTime, filter, finalize, map, pluck, startWith, Subject, switchMap, tap } from 'rxjs';
import { trackById } from '@util/track-by';
import { PlayerService } from '../../player/player.service';
import { PlayerModalService } from '../../player/player-modal.service';
import { Control } from '@stlmpp/control';
import { Player } from '@model/player';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { arrayUtil } from 'st-utils';

interface ModeratorManage extends ModeratorWithInfo {
  new: boolean;
  deleted: boolean;
}

function mapModeratorManage(moderators: ModeratorWithInfo[]): ModeratorManage[] {
  return moderators.map(moderator => ({ ...moderator, new: false, deleted: false }));
}

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
    private playerModalService: PlayerModalService,
    private modalRef: ModalRef<ForumModeratorManagementComponent>
  ) {
    super();
  }

  private _id = -1;
  private readonly _refreshPlayers$ = new Subject<void>();

  loading = true;
  loadingPlayers = false;
  moderators: ModeratorManage[] = [];
  players: Player[] = [];
  readonly trackById = trackById;

  readonly termControl = new Control('');
  loadingPlayerSearchModal = false;
  saving = false;

  private _getIdPlayersSelected(): number[] {
    return this.moderators.map(moderator => moderator.idPlayer);
  }

  private _addNewModerator(player: Player): void {
    if (this.moderators.some(moderator => moderator.idPlayer === player.id)) {
      return;
    }
    this.moderators = [
      ...this.moderators,
      {
        id: this._id--,
        new: true,
        idPlayer: player.id,
        playerPersonaName: player.personaName,
        deleteAllowed: true,
        deleted: false,
      },
    ];
    this.changeDetectorRef.markForCheck();
  }

  onDeletedChange(idModerator: number, $event: boolean): void {
    this.moderators = arrayUtil(this.moderators).update(idModerator, { deleted: $event }).toArray();
    this.changeDetectorRef.markForCheck();
  }

  onAutocompleteSelect(player: Player): void {
    this._addNewModerator(player);
    this._refreshPlayers$.next();
  }

  async openPlayerSearchModal(): Promise<void> {
    this.loadingPlayerSearchModal = true;
    const modalRef = await this.playerModalService.openPlayerSearchModal({
      idPlayersSelected: this._getIdPlayersSelected(),
    });
    modalRef.onClose$.subscribe(player => {
      if (player) {
        this._addNewModerator(player);
      }
    });
    this.loadingPlayerSearchModal = false;
    this.changeDetectorRef.markForCheck();
  }

  save(): void {
    this.saving = true;
    const dto: ModeratorAddAndDeleteDto = { add: [], delete: [] };
    for (const moderator of this.moderators) {
      if (moderator.new && !moderator.deleted) {
        dto.add.push(moderator.idPlayer);
      }
      if (moderator.deleted && !moderator.new) {
        dto.delete.push(moderator.id);
      }
    }
    this.moderatorService
      .andAndDelete(dto)
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

  ngOnInit(): void {
    this.moderatorService
      .getAll()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        }),
        map(mapModeratorManage)
      )
      .subscribe(moderators => {
        this.moderators = moderators;
      });
    combineLatest([this.termControl.value$.pipe(debounceTime(500)), this._refreshPlayers$.pipe(startWith(null))])
      .pipe(
        map(([term]) => term),
        tap(term => {
          if (term.length < 3) {
            this.players = [];
            this.changeDetectorRef.markForCheck();
          }
        }),
        filter(term => term.length >= 3),
        switchMap(personaName => {
          this.loadingPlayers = true;
          this.changeDetectorRef.markForCheck();
          return this.playerService.search(personaName, 1, 8, this._getIdPlayersSelected()).pipe(
            finalize(() => {
              this.loadingPlayers = false;
              this.changeDetectorRef.markForCheck();
            })
          );
        }),
        pluck('items')
      )
      .subscribe(players => {
        this.players = players;
      });
  }
}
