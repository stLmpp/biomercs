import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminError } from '@model/admin-error';
import { PaginationMeta } from '@model/pagination';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { finalize, takeUntil } from 'rxjs';
import { ErrorService } from '@shared/services/error/error.service';
import { trackById } from '@util/track-by';
import { Clipboard } from '@angular/cdk/clipboard';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { LoadingComponent } from '../../shared/components/spinner/loading/loading.component';
import { PageTitleComponent } from '../../shared/title/page-title.component';
import { AccordionDirective } from '../../shared/components/accordion/accordion.directive';
import { AccordionItemComponent } from '../../shared/components/accordion/accordion-item.component';
import { HighlightModule } from 'ngx-highlightjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TooltipDirective } from '../../shared/components/tooltip/tooltip.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bio-admin-errors',
  templateUrl: './admin-errors.component.html',
  styleUrls: ['./admin-errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingComponent,
    PageTitleComponent,
    AccordionDirective,
    AccordionItemComponent,
    HighlightModule,
    ButtonComponent,
    TooltipDirective,
    IconComponent,
    PaginationComponent,
    DatePipe,
  ],
})
export class AdminErrorsComponent extends Destroyable {
  private activatedRoute = inject(ActivatedRoute);
  private errorService = inject(ErrorService);
  private clipboard = inject(Clipboard);
  private changeDetectorRef = inject(ChangeDetectorRef);

  private _page = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.page) ?? 1);
  private _itemsPerPage = +(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);

  loading = false;
  meta: PaginationMeta | null = this.activatedRoute.snapshot.data[RouteDataEnum.errors]?.meta ?? null;
  errors: AdminError[] = this.activatedRoute.snapshot.data[RouteDataEnum.errors]?.items ?? [];
  readonly trackBy = trackById;

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
