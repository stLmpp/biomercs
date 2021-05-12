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
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { trackByFactory } from '@stlmpp/utils';

export interface ScoreTableState<T extends Record<any, any>, K extends keyof T = keyof T> {
  colDefs: ColDefInternal<T, K>[];
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
    super(
      { colDefs: [], data: [], colDefDefault: {} },
      {
        inputs: [
          'data',
          { key: 'colDefs', transformer: colDefs => ColDefInternal.convertAll(colDefs as ColDef<T, K>[]) },
          'colDefDefault',
        ],
      }
    );
  }

  private _colDefDefault$ = this.selectState('colDefDefault');
  private _colDefs$ = this.selectState('colDefs');

  @Input() loading: BooleanInput = false;
  @Input() data: T[] = [];
  @Input() paginationMeta?: PaginationMetaVW | null;
  @Input() itemsPerPageOptions: number[] = [];
  @Input() order?: TableOrder<T> | null;
  @Input() colDefs: ColDef<T>[] = [];
  @Input() colDefDefault: Partial<ColDef<T>> = {};
  @Input() metadata: any;
  @Input() title?: string;

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly orderChange = new EventEmitter<TableOrder<T>>();
  @Output() readonly notifyChange = new EventEmitter<TableCellNotifyChange<any, T, K>>();

  colDefs$: Observable<ColDefInternal<T, K>[]> = combineLatest([this._colDefs$, this._colDefDefault$]).pipe(
    map(([colDefs, colDefDefault]) => colDefs.map(colDef => ({ ...colDefDefault, ...colDef })))
  );
  data$ = this.selectState('data');

  trackByColDef = trackByFactory<ColDefInternal<T, K>>('id');

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
}
