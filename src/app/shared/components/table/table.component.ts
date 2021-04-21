import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { BooleanInput } from 'st-utils';
import { PaginationMetaVW } from '@model/pagination';
import { LocalState } from '@stlmpp/store';
import { ColDef, ColDefInternal } from '@shared/components/table/col-def';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableDataWithFormatted, TableOrder } from '@shared/components/table/type';
import { getFormattedKey } from '@shared/components/table/util';
import { trackByFactory } from '@stlmpp/utils';

let uid = 99;

export interface ScoreTableState<T extends Record<any, any>, K extends keyof T = keyof T> {
  colDefs: ColDef<T, K>[];
  data: T[];
  colDefDefault: Partial<ColDef<T, K>>;
}

@Component({
  selector: 'bio-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T extends Record<any, any>, K extends keyof T> extends LocalState<ScoreTableState<T, K>> {
  constructor() {
    super({ colDefs: [], data: [], colDefDefault: {} }, { inputs: ['data', 'colDefs', 'colDefDefault'] });
  }

  private _colDefDefault$ = this.selectState('colDefDefault');
  private _colDefs$ = this.selectState('colDefs');
  private _colDefsInteral$ = this._colDefs$.pipe(map(colDefs => this._convertToColDefInternal(colDefs)));
  private _data$ = this.selectState('data');

  @Input() loading: BooleanInput = false;
  @Input() data: T[] = [];
  @Input() paginationMeta?: PaginationMetaVW;
  @Input() itemsPerPageOptions: number[] = [];
  @Input() order?: TableOrder<T>;
  @Input() colDefs: ColDef<T>[] = [];
  @Input() colDefDefault: Partial<ColDef<T>> = {};

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly orderChange = new EventEmitter<TableOrder<T>>();

  colDefs$: Observable<ColDefInternal<T, K>[]> = combineLatest([this._colDefsInteral$, this._colDefDefault$]).pipe(
    map(([colDefs, colDefDefault]) => colDefs.map(colDef => ({ ...colDefDefault, ...colDef })))
  );
  data$: Observable<TableDataWithFormatted<T>[]> = combineLatest([this._data$, this.colDefs$]).pipe(
    map(([data, colDefs]) =>
      data.map(item => {
        for (const colDef of colDefs) {
          item = { ...item, [colDef.propertyFormatted]: colDef.formatter(item[colDef.property], item, colDef) };
        }
        return item as TableDataWithFormatted<T>;
      })
    )
  );

  trackByColDef = trackByFactory<ColDefInternal<T, K>>('id');

  private _convertToColDefInternal(colDefs: ColDef<T, K>[]): ColDefInternal<T, K>[] {
    return colDefs.map(colDef => ({
      ...colDef,
      id: uid++,
      headerStyle: colDef.headerStyle ?? colDef.style ?? null,
      bodyStyle: colDef.bodyStyle ?? colDef.style ?? null,
      formatter: colDef.formatter ?? (value => value && `${value}`),
      propertyFormatted: getFormattedKey(colDef.property),
    }));
  }

  @Input() trackBy: TrackByFunction<T> = index => index;

  changeOrder(orderBy: keyof T): void {
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
}
