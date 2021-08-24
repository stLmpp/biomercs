import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterDeleted' })
export class FilterDeletedPipe implements PipeTransform {
  transform<T extends { deletedDate?: Date | null }>(value: T[], hideDeleted: boolean): T[] {
    if (!hideDeleted) {
      return value;
    }
    return value.filter(item => !item.deletedDate);
  }
}
