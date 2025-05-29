import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
    name: 'scoreFormat',
    standalone: false
})
export class ScoreFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0) {
      return '0';
    }
    if (value < 1000) {
      return formatNumber(value, 'pt-BR', '1.0-0');
    }
    return formatNumber(Math.floor(value / 1000), 'pt-BR', '1.0-0') + 'k';
  }
}
