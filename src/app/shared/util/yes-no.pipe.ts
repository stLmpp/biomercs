import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'yesNo' })
export class YesNoPipe implements PipeTransform {
  transform(value: any): 'Yes' | 'No' {
    return value ? 'Yes' : 'No';
  }
}
