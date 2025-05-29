import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TrackByFunction,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { ColDef, ColDefInternal } from '@shared/components/table/col-def';
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { trackById } from '@util/track-by';
import { CardComponent } from '../card/card.component';
import { LoadingComponent } from '../spinner/loading/loading.component';
import { CardTitleDirective } from '../card/card-title.directive';
import { CardContentDirective } from '../card/card-content.directive';
import { NgLetModule } from '@stlmpp/utils';
import { NgStyle } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { CardActionsDirective } from '../card/card-actions.directive';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'bio-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CardComponent,
    LoadingComponent,
    CardTitleDirective,
    CardContentDirective,
    NgLetModule,
    NgStyle,
    IconComponent,
    TableCellComponent,
    CardActionsDirective,
    PaginationComponent,
  ],
})
export class TableComponent<T extends Record<any, any>, K extends keyof T> {
  private _collapsable = false;
  private _colDefs: ColDefInternal<T, K>[] = [];
  private _colDefDefault: Partial<ColDef<T, K>> = {};

  readonly loading = input<BooleanInput>(false);
  readonly data = input<T[]>([]);
  readonly paginationMeta = input<PaginationMeta | null>();
  readonly itemsPerPageOptions = input<number[]>([]);
  readonly order = input<TableOrder<T> | null>();
  readonly metadata = input<any>();
  readonly title = input<string>();

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

  readonly currentPageChange = output<number>();
  readonly itemsPerPageChange = output<number>();
  readonly orderChange = output<TableOrder<T>>();
  readonly notifyChange = output<TableCellNotifyChange<any, T, K>>();

  colDefsInternal: ColDefInternal<T, K>[] = [];

  readonly trackByColDef = trackById;

  private _updateColDefsInternal(): void {
    this.colDefsInternal = this._colDefs.map(colDef => ({ ...colDef, ...this._colDefDefault }));
  }

  readonly trackBy = input<TrackByFunction<T>>(index => index);

  changeOrder(orderBy: keyof T | string): void {
    const order = this.order();
    if (order) {
      if (order.orderBy === orderBy) {
        this.orderChange.emit({
          ...order,
          orderByDirection: order.orderByDirection === 'asc' ? 'desc' : 'asc',
        });
      } else {
        this.orderChange.emit({ ...order, orderBy });
      }
    }
  }

  static ngAcceptInputType_collapsable: BooleanInput;
}
