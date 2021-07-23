import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminError } from '@model/admin-error';
import { PaginationMeta } from '@model/pagination';
import { LocalState } from '@stlmpp/store';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { debounceTime, finalize, skip, switchMap } from 'rxjs';
import { ErrorService } from '@shared/services/error/error.service';
import { trackById } from '@util/track-by';
import { Clipboard } from '@angular/cdk/clipboard';

interface AdminErrorsComponentState {
  loading: boolean;
  errors: AdminError[];
  meta: PaginationMeta;
  page: number;
  itemsPerPage: number;
}

@Component({
  selector: 'bio-admin-errors',
  templateUrl: './admin-errors.component.html',
  styleUrls: ['./admin-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminErrorsComponent extends LocalState<AdminErrorsComponentState> implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private errorService: ErrorService,
    private clipboard: Clipboard
  ) {
    super({
      errors: activatedRoute.snapshot.data[RouteDataEnum.errors]?.items ?? [],
      meta: activatedRoute.snapshot.data[RouteDataEnum.errors]?.meta ?? {
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
      },
      loading: false,
      page: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1),
      itemsPerPage: +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10),
    });
  }

  readonly errors$ = this.selectState('errors');
  readonly meta$ = this.selectState('meta');
  readonly loading$ = this.selectState('loading');
  readonly trackBy = trackById;

  onItemsPerPage(itemsPerPage: number): void {
    this.updateState({ itemsPerPage });
  }

  onCurrentPageChange(page: number): void {
    this.updateState({ page });
  }

  ngOnInit(): void {
    this.selectState(['page', 'itemsPerPage'])
      .pipe(
        skip(1),
        debounceTime(100),
        switchMap(({ page, itemsPerPage }) => {
          this.updateState({ loading: true });
          return this.errorService.paginate(page, itemsPerPage).pipe(
            finalize(() => {
              this.updateState({ loading: false });
            })
          );
        })
      )
      .subscribe(({ items, meta }) => {
        this.updateState({ errors: items, meta });
      });
  }

  copyQueryToClipboard(query: string): void {
    this.clipboard.copy(query);
  }
}
