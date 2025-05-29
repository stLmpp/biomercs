import { Pipe, PipeTransform } from '@angular/core';
import { Player, PlayerUpdate } from '@model/player';
import { isObjectEmpty } from 'st-utils';
import { isBefore, subDays } from 'date-fns';

export function playerProfileValidatePersonaName(
  player: Player,
  newPersonaName: string | null
): newPersonaName is string {
  return (
    !!newPersonaName &&
    newPersonaName.length >= 3 &&
    newPersonaName !== player.personaName &&
    (!player.lastUpdatedPersonaNameDate || isBefore(player.lastUpdatedPersonaNameDate, subDays(new Date(), 7)))
  );
}

@Pipe({ name: 'playerProfileInvalid' })
export class PlayerProfileInvalidPipe implements PipeTransform {
  transform(player: Player, update: PlayerUpdate, newPersonaName: string | null): boolean {
    if (newPersonaName) {
      return !playerProfileValidatePersonaName(player, newPersonaName);
    }
    return isObjectEmpty(update);
  }
}
