import { Pipe, PipeTransform } from '@angular/core';
import { arraySearch } from 'st-utils';

@Pipe({ name: 'searchIf' })
export class SearchIfPipe implements PipeTransform {
  transform<T extends { id: number }>(value: T[], search: boolean, key: keyof T, term: string | null | undefined): T[] {
    if (!search || !term) {
      return value;
    }
    return arraySearch(value, key, term);
  }
}
