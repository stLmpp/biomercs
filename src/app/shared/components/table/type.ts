import { OrderByDirection } from 'st-utils';
import { ColDefInternal } from '@shared/components/table/col-def';
import { Directive, EventEmitter, output, Output, Type } from '@angular/core';

export interface TableOrder<T extends Record<any, any>> {
  orderBy?: keyof T | string | null;
  orderByDirection: OrderByDirection;
}

@Directive()
export abstract class TableCell<T extends Record<any, any>, K extends keyof T = keyof T> {
  readonly notifyChange = output<any>();

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
