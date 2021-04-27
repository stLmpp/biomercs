import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PaginationMetaVW } from '@model/pagination';
import { ScoreVW } from '@model/score';
import { LocalState } from '@stlmpp/store';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Control } from '@stlmpp/control';
import { Player } from '@model/player';
import { AuthQuery } from '../../auth/auth.query';
import { ScoreService } from '../score.service';
import { combineLatest } from 'rxjs';
import { ScoreStatusEnum } from '@model/enum/score-status.enum';
import { getScoreDefaultColDefs } from '../score-shared/util';
import { AuthDateFormatPipe } from '../../auth/shared/auth-date-format.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export interface ScoreSearchComponentState {
  scores: ScoreVW[];
  paginationMeta: PaginationMetaVW;
  page: number;
  itemsPerPage: number;
  loading: boolean;
}

@Component({
  selector: 'bio-score-search',
  templateUrl: './score-search.component.html',
  styleUrls: ['./score-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreSearchComponent extends LocalState<ScoreSearchComponentState> implements OnInit {
  constructor(
    private authQuery: AuthQuery,
    private scoreService: ScoreService,
    private authDateFormatPipe: AuthDateFormatPipe,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super({
      itemsPerPage: 10,
      page: 1,
      scores: [],
      paginationMeta: {
        itemCount: 0,
        totalPages: 0,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10,
      },
      loading: false,
    });
  }

  termControl = new Control<string>(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.term) ?? '');
  onlyMyScores = false;

  scores$ = this.selectState('scores');
  paginationMeta$ = this.selectState('paginationMeta');
  loading$ = this.selectState('loading');

  colDefs = getScoreDefaultColDefs(this.authDateFormatPipe);

  get player(): Player {
    // Not possible to access this page without it
    return this.authQuery.getUser()!.player!;
  }

  changeOnlyMyScores($event: boolean): void {
    this.onlyMyScores = $event;
    const term = this.termControl.value;
    const personaName = this.player.personaName;
    if ($event) {
      if (!term.includes(`pl:${personaName}`) && !term.includes(`player:${personaName}`)) {
        this.termControl.setValue(`${term}${term.endsWith(' ') || !term.length ? '' : ' '}player:${personaName}`);
      }
    } else {
      const regex = new RegExp(`(pl:${personaName}|player:${personaName})`, 'g');
      this.termControl.setValue(term.replace(regex, ''));
    }
  }

  onCurrentPageChange($event: number): void {
    this.updateState({ page: $event });
  }

  onItemsPerPageChange($event: number): void {
    this.updateState({ itemsPerPage: $event });
  }

  async openInfoScore(score: ScoreVW): Promise<void> {
    await this.scoreService.openModalScoreInfo({ score, showWorldRecord: true, showApprovalDate: true });
  }

  ngOnInit(): void {
    combineLatest([
      this.termControl.value$.pipe(
        distinctUntilChanged((termA, termB) => termA.trim() === termB.trim()),
        tap(term => {
          const personaName = this.player.personaName;
          this.onlyMyScores = term.includes(`pl:${personaName}`) || term.includes(`player:${personaName}`);
        }),
        debounceTime(600),
        tap(term => {
          this.router
            .navigate([], {
              relativeTo: this.activatedRoute,
              queryParamsHandling: 'merge',
              queryParams: { [RouteParamEnum.term]: term },
            })
            .then();
        }),
        filter(term => !!term.length)
      ),
      this.selectState(['page', 'itemsPerPage']),
    ])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([term, { page, itemsPerPage }]) => {
          this.updateState({ loading: true });
          return this.scoreService.search(term, ScoreStatusEnum.Approved, page, itemsPerPage).pipe(
            finalize(() => {
              this.updateState({ loading: false });
            })
          );
        })
      )
      .subscribe(({ items, meta }) => {
        this.updateState({ paginationMeta: meta, scores: items });
      });
  }
}
