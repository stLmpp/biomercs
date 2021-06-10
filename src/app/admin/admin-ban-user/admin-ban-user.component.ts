import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user/user.service';
import { Control, ControlGroup } from '@stlmpp/control';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { debounceTime, distinctUntilChanged, filter, finalize, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { LocalState } from '@stlmpp/store';
import { filterNil } from '@shared/operators/filter';
import { trackByUser, User } from '@model/user';
import { Pagination, PaginationMetaVW } from '@model/pagination';
import { arrayUtil } from 'st-utils';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { isAfter, subDays } from 'date-fns';
import { mdiShieldAccount } from '@mdi/js';

interface UserSearchForm {
  term: string;
  page: number;
  limit: number;
}

interface AdminBanUserComponentState {
  loading: boolean;
  data: Pagination<User>;
}

@Component({
  selector: 'bio-admin-ban-user',
  templateUrl: './admin-ban-user.component.html',
  styleUrls: ['./admin-ban-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBanUserComponent extends LocalState<AdminBanUserComponentState> implements OnInit {
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialogService: DialogService
  ) {
    super({
      loading: false,
      data: { items: [], meta: { itemCount: 0, totalItems: 0, totalPages: 0, itemsPerPage: 10, currentPage: 1 } },
    });
  }

  readonly dateMinus7 = subDays(new Date(), 7);
  readonly mdiShieldAccount = mdiShieldAccount;

  readonly form = new ControlGroup<UserSearchForm>({
    page: new Control(this._getNumberParamOrNull(RouteParamEnum.page) ?? 1),
    limit: new Control(this._getNumberParamOrNull(RouteParamEnum.limit) ?? 10),
    term: new Control(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.term) ?? ''),
  });

  readonly loading$ = this.selectState('loading');

  readonly term$ = this.form.get('term').value$.pipe(debounceTime(400), distinctUntilChanged());
  readonly page$ = this.form.get('page').value$.pipe(distinctUntilChanged(), debounceTime(100));
  readonly limit$ = this.form.get('limit').value$.pipe(distinctUntilChanged());

  readonly data$ = this.selectState('data');
  readonly users$: Observable<User[]> = this.data$.pipe(filterNil(), pluck('items'));
  readonly paginationMeta$: Observable<PaginationMetaVW> = this.data$.pipe(filterNil(), pluck('meta'));

  readonly trackByUser = trackByUser;

  private _getNumberParamOrNull(param: string): number | null {
    return this.activatedRoute.snapshot.queryParamMap.has(param)
      ? +this.activatedRoute.snapshot.queryParamMap.get(param)!
      : null;
  }

  private _updateUser(idUser: number, partial: Partial<User>): void {
    this.updateState('data', data => ({ ...data, items: arrayUtil(data.items, 'id').update(idUser, partial).get() }));
  }

  pageChange($event: number): void {
    this.form.get('page').setValue($event);
  }

  itemPerPageChange($event: number): void {
    this.form.patchValue({ page: 1, limit: $event });
  }

  action(user: User): void {
    let title = `Ban ${user.username}`;
    let content = `${user.username} will not be able to login. <br> There'll be a cooldown of 7 days to do an unban.`;
    let request$ = this.userService.banUser(user.id).pipe(
      tap(() => {
        this._updateUser(user.id, { bannedDate: new Date() });
      })
    );
    if (user.bannedDate) {
      if (isAfter(user.bannedDate, subDays(new Date(), 7))) {
        return;
      }
      title = 'Un' + title.substring(1);
      content = `${user.username} will be able to login.`;
      request$ = this.userService.unbanUser(user.id).pipe(
        tap(() => {
          this._updateUser(user.id, { bannedDate: null });
        })
      );
    }
    this.dialogService.confirm({ title, content, yesAction: request$, btnNo: 'Cancel', btnYes: 'Ban' }).subscribe();
  }

  ngOnInit(): void {
    this.form
      .get('term')
      .valueChanges$.pipe(takeUntil(this.destroy$), debounceTime(400), distinctUntilChanged())
      .subscribe(term => {
        this.router
          .navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { [RouteParamEnum.term]: term },
            queryParamsHandling: 'merge',
          })
          .then();
        this.form.patchValue({ page: 1 });
      });
    combineLatest([this.term$, this.page$, this.limit$])
      .pipe(
        debounceTime(50),
        filter(([term]) => term.length >= 3),
        switchMap(([term, page, limit]) => {
          this.updateState({ loading: true });
          return this.userService.search(term, page, limit).pipe(
            finalize(() => {
              this.updateState({ loading: false });
            })
          );
        })
      )
      .subscribe(data => {
        this.updateState({ data });
      });
  }
}
