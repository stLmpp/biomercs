import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminError } from '@model/admin-error';
import { PaginationMeta } from '@model/pagination';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { finalize, takeUntil } from 'rxjs';
import { ErrorService } from '@shared/services/error/error.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-admin-errors',
  templateUrl: './admin-errors.component.html',
  styleUrls: ['./admin-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminErrorsComponent extends Destroyable {
  constructor(
    private activatedRoute: ActivatedRoute,
    private errorService: ErrorService,
    private clipboard: Clipboard,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  private _page = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1);
  private _itemsPerPage = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);

  loading = false;
  meta: PaginationMeta | null = this.activatedRoute.snapshot.data[RouteDataEnum.errors]?.meta ?? null;
  errors: AdminError[] = this.activatedRoute.snapshot.data[RouteDataEnum.errors]?.items ?? [];
  readonly trackBy = trackByFactory<AdminError>('id');

  private _findErrors(): void {
    this.loading = true;
    this.errorService
      .paginate(this._page, this._itemsPerPage)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(({ items, meta }) => {
        this.errors = items;
        this.meta = meta;
      });
  }

  onItemsPerPage(itemsPerPage: number): void {
    this._itemsPerPage = itemsPerPage;
    this._findErrors();
  }

  onCurrentPageChange(page: number): void {
    this._page = page;
    this._findErrors();
  }

  copyQueryToClipboard(query: string): void {
    this.clipboard.copy(query);
  }
}
