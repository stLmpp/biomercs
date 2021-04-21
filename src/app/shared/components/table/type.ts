import { OrderByDirection } from 'st-utils';
import { ColDefInternal } from '@shared/components/table/col-def';
import { Type } from '@angular/core';

export type TableDataWithFormatted<T extends Record<any, any>> = {
  [K in keyof T as `${K & string}Formatted`]: string;
} &
  T;

export interface TableOrder<T extends Record<any, any>> {
  orderBy: keyof T;
  orderByDirection: OrderByDirection;
}

export abstract class BioCellComponent<T extends Record<any, any>, K extends keyof T = keyof T> {
  item!: T;
  colDef!: ColDefInternal<T, K>;
}

export type BioCellComponentType = Type<BioCellComponent<any, any>>;
