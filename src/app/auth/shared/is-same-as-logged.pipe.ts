import { Pipe, PipeTransform, inject } from '@angular/core';
import { AuthQuery } from '../auth.query';
import { Player } from '@model/player';
import { isNumber } from 'st-utils';

@Pipe({ name: 'isSameAsLogged' })
export class IsSameAsLoggedPipe implements PipeTransform {
  private authQuery = inject(AuthQuery);


  transform(value: number | Player): boolean {
    const idPlayer = isNumber(value) ? value : value.id;
    return idPlayer === this.authQuery.getUser()?.idPlayer;
  }
}
