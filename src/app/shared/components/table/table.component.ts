import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { ColDef, ColDefInternal } from '@shared/components/table/col-def';
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { trackById } from '@util/track-by';

@Component({
    selector: 'bio-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TableComponent<T extends Record<any, any>, K extends keyof T> {
  private _collapsable = false;
  private _colDefs: ColDefInternal<T, K>[] = [];
  private _colDefDefault: Partial<ColDef<T, K>> = {};

  @Input() loading: BooleanInput = false;
  @Input() data: T[] = [];
  @Input() paginationMeta?: PaginationMeta | null;
  @Input() itemsPerPageOptions: number[] = [];
  @Input() order?: TableOrder<T> | null;
  @Input() metadata: any;
  @Input() title?: string;

  @Input()
  get collapsable(): boolean {
    return this._collapsable;
  }
  set collapsable(collapsable: boolean) {
    this._collapsable = coerceBooleanProperty(collapsable);
  }

  @Input()
  set colDefs(colDefs: ColDef<T, K>[]) {
    this._colDefs = ColDefInternal.convertAll(colDefs);
    this._updateColDefsInternal();
  }

  @Input()
  set colDefDefault(colDefDefault: Partial<ColDef<T, K>>) {
    this._colDefDefault = colDefDefault;
    this._updateColDefsInternal();
  }

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly orderChange = new EventEmitter<TableOrder<T>>();
  @Output() readonly notifyChange = new EventEmitter<TableCellNotifyChange<any, T, K>>();

  colDefsInternal: ColDefInternal<T, K>[] = [];

  readonly trackByColDef = trackById;

  private _updateColDefsInternal(): void {
    this.colDefsInternal = this._colDefs.map(colDef => ({ ...colDef, ...this._colDefDefault }));
  }

  @Input() trackBy: TrackByFunction<T> = index => index;

  changeOrder(orderBy: keyof T | string): void {
    if (this.order) {
      if (this.order.orderBy === orderBy) {
        this.orderChange.emit({
          ...this.order,
          orderByDirection: this.order.orderByDirection === 'asc' ? 'desc' : 'asc',
        });
      } else {
        this.orderChange.emit({ ...this.order, orderBy });
      }
    }
  }

  static ngAcceptInputType_collapsable: BooleanInput;
}
