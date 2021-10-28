export interface SimpleChangeCustom<T = any> {
  previousValue: T;
  currentValue: T;
  firstChange: boolean;
  isFirstChange(): boolean;
}

export type SimpleChangesCustom<T extends Record<any, any> = any> = { [K in keyof T]?: SimpleChangeCustom<T[K]> };
