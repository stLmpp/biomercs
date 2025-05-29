import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableCellTooltip',
    standalone: false
})
export class TableCellTooltipPipe implements PipeTransform {
  transform<T extends Record<any, any>, K extends keyof T = keyof T>(item: T, tooltip: K | boolean, value: any): any {
    if (tooltip) {
      if (tooltip === true) {
        return value;
      } else {
        return item[tooltip];
      }
    }
    return '';
  }
}
