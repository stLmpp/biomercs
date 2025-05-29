import { Pipe, PipeTransform } from '@angular/core';
import { AuthQuery } from '../auth.query';
import { Player } from '@model/player';
import { isNumber } from 'st-utils';

@Pipe({
    name: 'isSameAsLogged',
    standalone: false
})
export class IsSameAsLoggedPipe implements PipeTransform {
  constructor(private authQuery: AuthQuery) {}

  transform(value: number | Player): boolean {
    const idPlayer = isNumber(value) ? value : value.id;
    return idPlayer === this.authQuery.getUser()?.idPlayer;
  }
}
