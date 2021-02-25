import { Pipe, PipeTransform } from '@angular/core';
import { isUndefined } from 'st-utils';

@Pipe({
  name: 'isDefined',
})
export class IsDefinedPipe implements PipeTransform {
  transform<T>(value: T): boolean {
    return !isUndefined(value);
  }
}
