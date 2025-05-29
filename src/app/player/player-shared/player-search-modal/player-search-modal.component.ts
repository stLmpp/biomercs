import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { Player } from '@model/player';
import { Control, ControlGroup } from '@stlmpp/control';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { combineLatest, debounceTime, filter, finalize, Observable, pluck, shareReplay, switchMap } from 'rxjs';
import { PlayerService } from '../../player.service';
import { PaginationMeta } from '@model/pagination';
import { trackById } from '@util/track-by';

export interface PlayerSearchModalComponentData {
  idPlayer?: number | null | undefined;
  idPlayersSelected: number[];
}

interface PlayerSearchModalComponentForm {
  page: number;
  limit: number;
  term: string;
}

@Component({
    selector: 'bio-player-search-modal',
    templateUrl: './player-search-modal.component.html',
    styleUrls: ['./player-search-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class PlayerSearchModalComponent {
  constructor(
    private modalRef: ModalRef<PlayerSearchModalComponent, PlayerSearchModalComponentData, Player | undefined>,
    @Inject(MODAL_DATA) { idPlayer, idPlayersSelected }: PlayerSearchModalComponentData,
    private playerService: PlayerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.idPlayer = idPlayer;
    this.idPlayersSelected = idPlayersSelected;
  }

  readonly idPlayer?: number | null | undefined;
  readonly idPlayersSelected: number[];

  readonly form = new ControlGroup<PlayerSearchModalComponentForm>({
    limit: new Control(10),
    page: new Control(1),
    term: new Control(''),
  });
  readonly term$ = this.form.get('term').value$;
  readonly termDebounce$ = this.term$.pipe(
    debounceTime(500),
    filter(term => !!term.length)
  );
  readonly page$ = this.form.get('page').value$;
  readonly limit$ = this.form.get('limit').value$;
  readonly data$ = combineLatest([this.termDebounce$, this.page$, this.limit$]).pipe(
    switchMap(([term, page, limit]) => {
      this.loading = true;
      this.changeDetectorRef.markForCheck();
      return this.playerService.searchPaginated(term, page, limit, this.idPlayersSelected).pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      );
    }),
    shareReplay()
  );
  readonly players$: Observable<Player[]> = this.data$.pipe(pluck('items'));
  readonly paginationMeta$: Observable<PaginationMeta> = this.data$.pipe(pluck('meta'));

  loading = false;

  readonly trackByPlayer = trackById;

  onCurrentPageChange($event: number): void {
    this.form.get('page').setValue($event);
  }

  onItemsPerPageChange($event: number): void {
    this.form.get('limit').setValue($event);
  }
}
