import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pagination' },
})
export class PaginationComponent implements OnChanges, PaginationMeta {
  constructor(private router: Router) {}

  private _setQueryParamsOnChange = false;
  private _itemsPerPageHidden = false;
  private _disabled = false;

  @Input()
  set setQueryParamsOnChange(setQueryParamsOnChange: boolean) {
    this._setQueryParamsOnChange = coerceBooleanProperty(setQueryParamsOnChange);
  }

  @Input() currentPage!: number;
  @Input() itemCount!: number;
  @Input() itemsPerPage!: number;
  @Input() totalItems!: number;
  @Input() totalPages!: number;
  @Input()
  get itemsPerPageHidden(): boolean {
    return this._itemsPerPageHidden;
  }
  set itemsPerPageHidden(itemsPerPageHidden: boolean) {
    this._itemsPerPageHidden = coerceBooleanProperty(itemsPerPageHidden);
  }

  @Input() itemsPerPageOptions = [5, 10, 25, 50, 100];

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

  @Output() readonly nextPage = new EventEmitter<number>();
  @Output() readonly previousPage = new EventEmitter<number>();
  @Output() readonly firstPage = new EventEmitter<number>();
  @Output() readonly lastPage = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly currentPageChange = new EventEmitter<number>();

  readonly trackByNumber = trackByFactory<number>();

  private _setQueryParams(): void {
    if (!this._setQueryParamsOnChange) {
      return;
    }
    this.router
      .navigate([], {
        queryParams: { [RouteParamEnum.page]: this.currentPage, [RouteParamEnum.itemsPerPage]: this.itemsPerPage },
        queryParamsHandling: 'merge',
      })
      .then();
  }

  onNextPage(): void {
    this.currentPage++;
    this.nextPage.emit(this.currentPage);
    this.currentPageChange.emit(this.currentPage);
    this._setQueryParams();
  }

  onPreviousPage(): void {
    this.currentPage--;
    this.previousPage.emit(this.currentPage);
    this.currentPageChange.emit(this.currentPage);
    this._setQueryParams();
  }

  onFirstPage(): void {
    this.currentPage = 1;
    this.firstPage.emit(this.currentPage);
    this.currentPageChange.emit(this.currentPage);
    this._setQueryParams();
  }

  onLastPage(): void {
    this.currentPage = this.totalPages;
    this.lastPage.emit(this.currentPage);
    this.currentPageChange.emit(this.currentPage);
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
