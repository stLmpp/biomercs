import { Nullable } from '@shared/type/nullable';
import { TemplateRef } from '@angular/core';
import { BioCellComponentType } from '@shared/components/table/type';

export interface ColDefTemplateRefContext<T extends Record<any, any>, K extends keyof T = keyof T> {
  item: T;
  colDef: ColDef<T, K>;
}

export interface ColDef<T extends Record<any, any>, K extends keyof T = keyof T> {
  property: K;
  tooltip?: keyof T;
  title?: string;
  orderBy?: boolean;
  width?: string;
  headerStyle?: Record<string, any> | null;
  bodyStyle?: Record<string, any> | null;
  style?: Record<string, any> | null;
  template?: TemplateRef<ColDefTemplateRefContext<T, K>>;
  component?: BioCellComponentType;
  formatter?(value: T[K], score: T, colDef: ColDefInternal<T, K>): Nullable<string>;
}

export interface ColDefInternal<T extends Record<any, any>, K extends keyof T = keyof T>
  extends Omit<ColDef<T, K>, 'headerStyle' | 'bodyStyle' | 'style'> {
  id: number;
  headerStyle: Record<string, any> | null;
  bodyStyle: Record<string, any> | null;
  propertyFormatted: `${K & string}Formatted`;
  formatter(value: T[K], score: T, colDef: ColDefInternal<T, K>): Nullable<string>;
}
