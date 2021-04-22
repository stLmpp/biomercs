import { OrderByDirection } from 'st-utils';
import { ColDefInternal } from '@shared/components/table/col-def';
import { Directive, EventEmitter, Output, Type } from '@angular/core';
import { Nullable } from '@shared/type/nullable';

export type TableDataWithFormatted<T extends Record<any, any>> = {
  [K in keyof T as `${K & string}Formatted`]: Nullable<string>;
} &
  T;

export interface TableOrder<T extends Record<any, any>> {
  orderBy?: keyof T | string | null;
  orderByDirection: OrderByDirection;
}

@Directive()
export abstract class TableCell<T extends Record<any, any>, K extends keyof T = keyof T> {
  @Output() readonly notifyChange = new EventEmitter<any>();

  item!: T;
  colDef!: ColDefInternal<T, K>;
  metadata?: any;
}

export type BioCellComponentType = Type<TableCell<any, any>>;

export interface TableCellNotifyChange<D, T extends Record<any, any>, K extends keyof T = keyof T> {
  item: T;
  colDef: ColDefInternal<T, K>;
  data: D;
}
