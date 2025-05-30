import { ChangeDetectionStrategy, Component, inject, Input, input, OnChanges, output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { StUtilsNumberModule, trackByFactory } from '@stlmpp/utils';
import { SelectComponent } from '../select/select.component';
import { StControlCommonModule, StControlModelModule } from '@stlmpp/control';
import { OptionComponent } from '../select/option.component';
import { ButtonComponent } from '../button/button.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'bio-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagination' },
  imports: [
    SelectComponent,
    StControlCommonModule,
    StControlModelModule,
    OptionComponent,
    ButtonComponent,
    TooltipDirective,
    IconComponent,
    StUtilsNumberModule,
  ],
})
export class PaginationComponent implements OnChanges {
  private router = inject(Router);

  private _setQueryParamsOnChange = false;
  private _itemsPerPageHidden = false;
  private _disabled = false;

  @Input()
  set setQueryParamsOnChange(setQueryParamsOnChange: boolean) {
    this._setQueryParamsOnChange = coerceBooleanProperty(setQueryParamsOnChange);
  }

  readonly currentPage = input.required<number>();
  readonly itemCount = input.required<number>();
  readonly itemsPerPage = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly totalPages = input.required<number>();
  @Input()
  get itemsPerPageHidden(): boolean {
    return this._itemsPerPageHidden;
  }
  set itemsPerPageHidden(itemsPerPageHidden: boolean) {
    this._itemsPerPageHidden = coerceBooleanProperty(itemsPerPageHidden);
  }

  readonly itemsPerPageOptions = input([5, 10, 25, 50, 100]);

  @Input()
  set meta(paginationMeta: PaginationMeta | null | undefined) {
    if (!paginationMeta) {
      paginationMeta = { currentPage: 1, itemsPerPage: 10, totalItems: 0, totalPages: 0, itemCount: 0 };
    }
    const { totalPages, totalItems, itemsPerPage, itemCount, currentPage } = paginationMeta;
    this.currentPage = currentPage;
    this.itemCount = itemCount;
    this.itemsPerPage = itemsPerPage;
    this.totalItems = totalItems;
    this.totalPages = totalPages;
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  readonly nextPage = output<number>();
  readonly previousPage = output<number>();
  readonly firstPage = output<number>();
  readonly lastPage = output<number>();
  readonly itemsPerPageChange = output<number>();
  readonly currentPageChange = output<number>();

  readonly trackByNumber = trackByFactory<number>();

  private _setQueryParams(): void {
    if (!this._setQueryParamsOnChange) {
      return;
    }
    this.router
      .navigate([], {
        queryParams: { [RouteParamEnum.page]: this.currentPage(), [RouteParamEnum.itemsPerPage]: this.itemsPerPage() },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  onNextPage(): void {
    currentPage++;
    this.nextPage.emit(currentPage);
    this.currentPageChange.emit(currentPage);
    this._setQueryParams();
  }

  onPreviousPage(): void {
    currentPage--;
    this.previousPage.emit(currentPage);
    this.currentPageChange.emit(currentPage);
    this._setQueryParams();
  }

  onFirstPage(): void {
    this.currentPage = 1;
    const currentPage = this.currentPage();
    this.firstPage.emit(currentPage);
    this.currentPageChange.emit(currentPage);
    this._setQueryParams();
  }

  onLastPage(): void {
    this.currentPage = this.totalPages();
    const currentPage = this.currentPage();
    this.lastPage.emit(currentPage);
    this.currentPageChange.emit(currentPage);
    this._setQueryParams();
  }

  ngOnChanges(): void {
    this._setQueryParams();
  }

  static ngAcceptInputType_setQueryParamsOnChange: BooleanInput;
  static ngAcceptInputType_itemsPerPageHidden: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static defaultItemsPerPageOptions = [5, 10, 25, 50, 100];
  static getItemsPerPageFromRoute(activatedRoute: ActivatedRoute, itemPerPageOptions?: number[]): number {
    itemPerPageOptions ??= PaginationComponent.defaultItemsPerPageOptions;
    const itemsPerPage = +(activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return itemPerPageOptions.includes(itemsPerPage) ? itemsPerPage : 10;
  }
}
