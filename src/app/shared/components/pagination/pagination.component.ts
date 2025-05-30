import { ChangeDetectionStrategy, Component, inject, Input, input, model, OnChanges, output } from '@angular/core';
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

  readonly currentPage = model.required<number>();
  readonly itemCount = model.required<number>();
  readonly itemsPerPage = model.required<number>();
  readonly totalItems = model.required<number>();
  readonly totalPages = model.required<number>();
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
    this.currentPage.set(currentPage);
    this.itemCount.set(itemCount);
    this.itemsPerPage.set(itemsPerPage);
    this.totalItems.set(totalItems);
    this.totalPages.set(totalPages);
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
    this.currentPage.update(value => value + 1);
    this.nextPage.emit(this.currentPage());
    this.currentPageChange.emit(this.currentPage());
    this._setQueryParams();
  }

  onPreviousPage(): void {
    this.currentPage.update(value => value - 1);
    this.previousPage.emit(this.currentPage());
    this.currentPageChange.emit(this.currentPage());
    this._setQueryParams();
  }

  onFirstPage(): void {
    this.currentPage.set(1);
    const currentPage = this.currentPage();
    this.firstPage.emit(currentPage);
    this.currentPageChange.emit(currentPage);
    this._setQueryParams();
  }

  onLastPage(): void {
    this.currentPage.set(this.totalPages());
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
