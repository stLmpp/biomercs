import { Nullable } from '@shared/type/nullable';
import { TemplateRef } from '@angular/core';
import { BioCellComponentType } from '@shared/components/table/type';
import { getFormattedKey } from '@shared/components/table/util';

let uid = 99;

export interface ColDefTemplateRefContext<T extends Record<any, any>, K extends keyof T = keyof T> {
  item: T;
  colDef: ColDef<T, K>;
}

export interface ColDef<T extends Record<any, any>, K extends keyof T = keyof T> {
  property: K;
  tooltip?: keyof T;
  title?: string;
  orderBy?: boolean;
  orderByKey?: string | K;
  width?: string;
  headerStyle?: Record<string, any> | null;
  bodyStyle?: Record<string, any> | null;
  style?: Record<string, any> | null;
  template?: TemplateRef<ColDefTemplateRefContext<T, K>>;
  component?: BioCellComponentType;
  formatter?(value: T[K], score: T, colDef: ColDefInternal<T, K>): Nullable<string>;
}

export class ColDefInternal<T extends Record<any, any>, K extends keyof T = keyof T> {
  constructor({ headerStyle, bodyStyle, style, formatter, property, orderByKey, ...colDef }: ColDef<T, K>) {
    this.id = uid++;
    this.headerStyle = headerStyle ?? style ?? null;
    this.bodyStyle = bodyStyle ?? style ?? null;
    this.formatter = formatter ?? (value => value && `${value}`);
    this.propertyFormatted = getFormattedKey(property);
    this.property = property;
    this.orderByKey = orderByKey ?? this.property;
    Object.assign(this, colDef);
  }

  id: number;
  headerStyle: Record<string, any> | null;
  bodyStyle: Record<string, any> | null;
  propertyFormatted: `${K & string}Formatted`;
  property: K;
  tooltip?: keyof T;
  title?: string;
  orderBy?: boolean;
  orderByKey?: string | K;
  width?: string;
  template?: TemplateRef<ColDefTemplateRefContext<T, K>>;
  component?: BioCellComponentType;
  formatter: (value: T[K], score: T, colDef: ColDefInternal<T, K>) => Nullable<string>;

  static convertAll<T1 extends Record<any, any>, K1 extends keyof T1 = keyof T1>(
    colDefs: ColDef<T1, K1>[]
  ): ColDefInternal<T1, K1>[] {
    return colDefs.map(colDef => new ColDefInternal<T1, K1>(colDef));
  }
}
