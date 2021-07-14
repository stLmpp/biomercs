import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { Player } from '@model/player';
import { Control, ControlGroup } from '@stlmpp/control';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { combineLatest, debounceTime, filter, finalize, Observable, pluck, shareReplay, switchMap } from 'rxjs';
import { LocalState } from '@stlmpp/store';
import { PlayerService } from '../../player.service';
import { PaginationMeta } from '@model/pagination';
import { trackById } from '@util/track-by';

export interface PlayerSearchModalComponentData {
  idPlayer?: number | null | undefined;
}

interface PlayerSearchModalComponentForm {
  page: number;
  limit: number;
  term: string;
}

interface PlayerSearchModalComponentState {
  loading: boolean;
}

@Component({
  selector: 'bio-player-search-modal',
  templateUrl: './player-search-modal.component.html',
  styleUrls: ['./player-search-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSearchModalComponent extends LocalState<PlayerSearchModalComponentState> {
  constructor(
    private modalRef: ModalRef<PlayerSearchModalComponent, PlayerSearchModalComponentData, Player | undefined>,
    @Inject(MODAL_DATA) { idPlayer }: PlayerSearchModalComponentData,
    private playerService: PlayerService
  ) {
    super({ loading: false });
    this.idPlayer = idPlayer;
  }

  idPlayer?: number | null | undefined;

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
      this.updateState({ loading: true });
      return this.playerService.search(term, page, limit).pipe(
        finalize(() => {
          this.updateState({ loading: false });
        })
      );
    }),
    shareReplay()
  );
  readonly players$: Observable<Player[]> = this.data$.pipe(pluck('items'));
  readonly paginationMeta$: Observable<PaginationMeta> = this.data$.pipe(pluck('meta'));
  readonly loading$ = this.selectState('loading');
  readonly trackByPlayer = trackById;

  onCurrentPageChange($event: number): void {
    this.form.get('page').setValue($event);
  }

  onItemsPerPageChange($event: number): void {
    this.form.get('limit').setValue($event);
  }
}
