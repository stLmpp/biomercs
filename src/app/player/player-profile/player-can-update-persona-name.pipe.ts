import { Pipe, PipeTransform } from '@angular/core';
import { isBefore, subDays } from 'date-fns';

@Pipe({ name: 'playerCanUpdatePersonaName' })
export class PlayerCanUpdatePersonaNamePipe implements PipeTransform {
  transform(lastUpdatedPersonaNameDate: Date | undefined): boolean {
    return !lastUpdatedPersonaNameDate || isBefore(lastUpdatedPersonaNameDate, subDays(new Date(), 7));
  }
}
