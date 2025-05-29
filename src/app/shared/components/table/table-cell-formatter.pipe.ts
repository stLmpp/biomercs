import { Pipe, PipeTransform } from '@angular/core';
import { TableCellFormatter } from '@shared/components/table/col-def';

@Pipe({ name: 'tableCellFormatter' })
export class TableCellFormatterPipe implements PipeTransform {
  transform<T extends Record<any, any>, K extends keyof T = keyof T>(
    value: T[K],
    formatter: TableCellFormatter<T, K>
  ): string | null | undefined {
    return formatter(value);
  }
}
